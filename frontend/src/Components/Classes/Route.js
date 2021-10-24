class Route{
    constructor(id, start="", end="", waypoints=[]) {
        this.id = id
        this.start = start;
        this.end = end;
        this.waypoints = waypoints;
    }

    toString() {
        return this.start + " --> " + this.end
    }
}
export default Route;