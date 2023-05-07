/**
 * Base class which can be extended by the implemented by Viewmodel implementation class. 
 * The constructor needs to be called immidately with the react component whose state we are modeling.
 * @example
 * VIEW MODEL
 * export const liveData = Object.freeze({
 *      myLiveDataLabel: new LiveData('optionalKeyNameForDebugging', 'initial Value of my live data');
 * })
 * export default class MyFormViewModel extends ViewModel {
 *     constructor(reactObj, injectedDepencency) {
 *         super(reactObj, liveData);
 *         ...
 *     }
 * 
 *     onSubmitClicked() {
 *         this.setLiveState(liveData.myLiveDataLabel, 'modified value')
 *     }
 * }
 * 
 * REACT COMPONENT
 * import MyFormViewModel, { liveData as STATE } from './MyFormViewModel';
 * 
 * class MyComponent extends React.Component {
 *      componentDidMount(){
 *          this.myFormViewModel = new MyFormViewModel(this, new DependencyToInject())
 *      }
 *      
 *      ...
 *      <div>{this.state[STATE.myLiveDataLabel]}</div>
*       <Button onClick={()=>{this.myFormViewModel.onSubmitClicked()}} >
 * }
 */
class ViewModel {
    /**
     * @param {React.Component} reactObj the react component  
     * @param {} liveDataInstancesContainer
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
    constructor(propertyName, defaultValue) {
        this.key = Symbol(propertyName);
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