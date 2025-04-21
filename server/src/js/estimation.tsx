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
    return (
        <li><button onClick={submit} value={props.card.getValue()}>{props.card.getValue()}</button></li>
    )
}
export default Estimation;