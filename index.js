/**
 * Base class which can be extended by the implemented by Viewmodel implementation class. 
 * The constructor needs to be called immidately with the react component whose state we are modeling.
 */
class ViewModel {
    /**
     * @param {React.Component} reactObj the react component  
     * @param {object} liveDataInstancesContainer object properties are the frozen live data instances
    */
   constructor(reactObj, liveDataInstancesContainer) {
        this.reactObj = reactObj;
        for (const [key, liveData] of Object.entries(liveDataInstancesContainer)) {
            if(liveData.key !== undefined) {   
                this.setLiveData(liveData, liveData.defaultValue)
            }
        }
    }
    
    /**
     * @param {LiveData} liveData the name of the state which will be updated
     * @param {any} propertyValue the value of the state
     */
    setLiveData(liveData, propertyValue) {
        this[liveData.key] = propertyValue;
        const nextStateUpdate = {};
        nextStateUpdate[liveData.key] = propertyValue;
        this.reactObj.setState(nextStateUpdate);
    }
    
    /**
     * @param {LiveData} liveData the name of the state
     * @returns the value of the state
     */
    getLiveData(liveData){
        return this[liveData.key];
    }
}

class LiveData {
    /**
     * @param {any} defaultValue the initial value of the live data
     * @param {string} optionalPropertyName OPTIONAL a name for debugging purposes
     */
    constructor(defaultValue, optionalPropertyName) {
        if(typeof optionalPropertyName !== 'string') {
            optionalPropertyName = '';
        }
        this.key = Symbol(optionalPropertyName);
        this.defaultValue = defaultValue;
    }
}

/**
 * Mocks ReactComponent state hooks
 */
class ReactStateComponentMock {
    setState() {
        //no-op for testing
    }
}

module.exports = ViewModel;
module.exports.LiveData = LiveData;
module.exports.ReactStateComponentMock = ReactStateComponentMock;