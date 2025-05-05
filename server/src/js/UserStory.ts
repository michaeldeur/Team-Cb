class UserStory {
    id?: string;
    storyNum?: string;

    name: string;
    description: string;
    storyValues?: number;
    _id?: string;
    constructor(name = "", description = "", id?: string, storyValues: undefined | number = undefined, storyNum: undefined | string = undefined) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.storyValues = storyValues;
    if (!storyNum) {
            this.storyNum = id;
        }
    }
    public setID(id: string) {
        if (!this.storyNum) {
            this.storyNum = id;
        }

        this.id = id;
    }
    public setStoryValues(value: number): void {
        this.storyValues = value;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public getStoryValues(): number | undefined {
        return this.storyValues;
    }

    public getDescription(): string {
        return `${this.description}`;
    }

    public toString(): string {
        return `${this.name}`;
    }
}

class UserStoryQueue {
    private stories: UserStory[];
    constructor() {
        this.stories = [];
    }
    // add to the array
    public addStory(story: UserStory): void {
        this.stories.push(story);
    }
    public isNext(): boolean {
        return this.stories.length != 0;
    }
    public findAt(i: number): UserStory | undefined {
        return this.stories[i];
    }
    public getLength(): number {
        return this.stories.length
    }
    public removeStory(id: number): void {
        this.stories.splice(id, 1);
    }
    // get the next element in the array
    public nextStory(): UserStory | undefined {
        let next = this.stories.shift();
        return next;
    }
    public getStories(): UserStory[] {
        return this.stories;
    }
}
export { UserStory, UserStoryQueue };
