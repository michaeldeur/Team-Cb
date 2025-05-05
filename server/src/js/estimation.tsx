import React, { useEffect } from "react"
import axios from "axios"
import "../../../client/dist/css/estimation.css"
import { UserStoryQueue, UserStory } from "./UserStory"
import { NavLink } from "react-router-dom"
import { Card, Cards } from "./Cards"
import Popup from "reactjs-popup"
import 'reactjs-popup/dist/index.css'
let storyQueue: UserStoryQueue = new UserStoryQueue();
let estimations: UserStoryQueue = new UserStoryQueue();
let cards: Cards = new Cards();
let currentStory: UserStory | undefined;
const URL = window.location.protocol + "//" + window.location.host + "/api/"; // base url for http requests

const fetch = axios.create({
    baseURL: URL,
    headers: {
        "Content-type": "application/json"
    },
    timeout: 30000 // timeout in ms for http requests
});

const Estimation = () => { // returns Estimation page
    return (<>
        <header>
            <h1>Got Scrum?</h1>
            <h5><strong>Team CB's Room<br />ID: 12345</strong></h5>
            <NavLink to={"/"}>Leave</NavLink>
        </header>
        <CurrentQueue storyQueue={storyQueue} cards={cards} />
        <StQueue storyQueue={storyQueue} />
        <Estimations estimations={estimations} />
    </>)
}
const CurrentQueue = (props: { storyQueue: UserStoryQueue; cards: Cards }) => { // returns middle section of Estimation page
    const [currentCards, setCards] = React.useState(props.cards);
    useEffect(() => { // gets estimated stories
        fetch.get("cards").then((response) => {
            setCards(response.data);
            response.data.forEach((card: any) => {
                cards.addCard(new Card(card.cardValue))
            }
            )
        })
    }, [])
    currentStory = storyQueue.findAt(0);
    let avg: number;
    let total = 0;
    let cardsList = cards.getCards();
    cardsList.sort(function (a: any, b: any) { return a.cardValue - b.cardValue })
    const ListCards = () => { // returns Estimation card buttons
        return (
            <>
                {cardsList.map((card, i) => (

                    <EstimationButton key={i} card={card} />
                ))}
            </>
        );
    }
    return (
        <section id="currentQueue">
            <div>
                <h3>Now estimating:</h3>
                <h4><Story story={currentStory} list={false} /></h4>
            </div>
            <h4>AVG</h4>
            <ul>
                <ListCards />
            </ul>
        </section>
    )

}
const StoryDialogBox = () => {
    let name = "";
    let description = "";
    return (
        <Popup trigger={<button id="storyButton">Add Story</button>} modal nested>
            <form className="modal" onSubmit={() => {
                let story = new UserStory(name);
                story.setDescription(description);
                fetch.post("storyQueue", story)
                }}>
                <input placeholder="Enter Story Name Here" name="storyName" id="storyName" onChange={event => {name = event.target.value}} required></input>
                <textarea placeholder="Enter Story Description Here" name="description" id="storyDesc" onChange={event => {description = event.target.value}}></textarea>
                <button type="submit" id="">Add Story</button>
            </form>
        </Popup>
    )
}
const StQueue = (props: { storyQueue: UserStoryQueue }) => { // returns the storyqueue section
    const [currentQueue, setQueue] = React.useState(props.storyQueue);
    useEffect(() => { // gets estimated stories
        fetch.get("storyQueue").then((response) => {
            setQueue(response.data);
            response.data.forEach((story: any) => {
                storyQueue.addStory(new UserStory(story.name, story.description, story.id))
            })
            storyQueue.getStories().sort((a, b) => a.id! - b.id!);
        })
    }, [])
    const List = () => { // returns a list of stories for storyqueue
        let stories = []
        for (let index = 1; index < storyQueue.getLength() - 1; index++) {
            stories.push(<Story key={index} story={storyQueue.findAt(index)} list={true} />)
            if (index == 1) {
                stories.push(<li key={storyQueue.getLength() + 1}></li>)
            }
        }
        stories.push(<StoryDialogBox key={0} />)
        // stories.push(<div key={0}><button id="storyButton" onClick={() => {
        //     fetch.post("storyQueue", new UserStory("New story"))
        // }}>Add Story</button></div>)
        return stories
    }
    return (
        <aside id="storyQueue">
            <h2>Story Queue</h2>
            <h6><i>Up next:</i></h6>
            <div></div>
            <ol>
                <List />
            </ol>
            <div></div>
        </aside>
    )
}
const Story = (props: { story: UserStory | undefined; list: boolean }) => { // returns a single story to be listed on the storyQueue
    let story: UserStory;
    if (props.story !== undefined) {
        story = new UserStory(props.story.toString(), props.story.description, props.story.id!);
        storyQueue.addStory(story)
        const deleteStory = () => {
            fetch.post("deleteStory", story)
        }
        if (props.list) {
            return (
                <li>
                    {story.toString()}
                    <button onClick={deleteStory}>Delete</button>
                </li>
            )
        } else {
            return (<>
                {story.toString()}
                <button onClick={deleteStory}>Delete</button>
            </>)
        }
    }

}

const Estimations = (props: { estimations: UserStoryQueue }) => { // returns already estimated stories section
    let story: UserStory;
    const getStyleClass = (value: number) => {
        if (value <= 3) return "story-small";
        if (value <= 5) return "story-medium";
        return "story-large";
    }    
    const [currentEstimations, setEstimations] = React.useState(props.estimations);
    useEffect(() => { // gets estimated stories
        fetch.get("estimations").then((response) => {
            setEstimations(response.data);
            response.data.forEach((story: any) => {
                estimations.addStory(new UserStory(story.name, story.description, story.id, story.storyValues))
            }
            )
            estimations.getStories().sort((a, b) => a.id! - b.id!)
        })
    }, [])
    const Estimation = (props: { userStory: UserStory | undefined }) => { // returns an already estimated story
        if (props.userStory !== undefined && props.userStory.getStoryValues() !== undefined) {
            story = new UserStory(props.userStory.toString(), props.userStory.description, props.userStory.id!, props.userStory.getStoryValues());
            estimations.addStory(story)
            return (
                <li className={getStyleClass(props.userStory.getStoryValues()!)}>{props.userStory.toString()}: <br />{props.userStory.getStoryValues()}</li>
            )
        }
    }
    const List = () => { // returns already estimated stories as a list
        let estimatedStories = [];

        for (let index = 0; index < estimations.getLength(); index++) {
            estimatedStories.push(<Estimation key={index} userStory={estimations.findAt(index)} />)
        }
        return estimatedStories;
    }
    return (
        <aside id="estimations">
            <h2>Estimations</h2>
            <ul>
                <List />
            </ul>
        </aside>
    )
}
const EstimationButton = (props: { card: Card }) => { // returns a single estimation card button
    const submit = () => {
        fetch.post("estimations", { value: props.card.getValue() })
    }
    if (props.card.getValue() == -1) { // acquiesce button
        return(
            <li><button onClick={submit} value={props.card.getValue()}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 16 16">
            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z"/>
          </svg></button></li>
        )
    }
    return (
        <li><button onClick={submit} value={props.card.getValue()}>{props.card.getValue()}</button></li>
    )
}
export default Estimation;