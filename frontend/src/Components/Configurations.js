import React, {Component} from 'react'
i

class Configurations extends Component {
    render() {
        return (
            <>
            <h1>This is the configuration page</h1>
            <form>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
            <input type="submit" value="Submit" />
            </form>
            </>
        );
    }
}
export default Configurations;