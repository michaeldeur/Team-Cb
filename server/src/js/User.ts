class User {
    private name: string;
    private uid: string;
    private points: number = -2;
    constructor(uid: string, name: string) {
        this.name = name;
        this.uid = uid;
    }
    getUID() {
        return this.uid;
    }
    getPoints() {
        return this.points;
    }
    setPoints(points: number) {
        this.points = points;
    }
    resetPoints() {
        this.points = -2;
    }
    public getName() {
        return this.name;
    }
    public toString() {
        return this.uid + "_" + this.name + "_" + this.points;
    }
}
export default User;