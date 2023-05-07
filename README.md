# React ViewModel

This module will allow for MVVM architecture development inside of the React Framework.

A base class which can be extended by the implemented by Viewmodel implementation class. 
The constructor needs to be called immidately with the react component whose state we are modeling.

# Getting Started

npm install react-view-model

# Example 

VIEW MODEL: MyFormViewModel.js

``` javascript
import ViewModel, { LiveData } from 'react-mvvm-view-model';
//declare your livedata properties and default values here
export const liveData = Object.freeze({
    myLiveDataLabel: new LiveData('optionalKeyNameForDebugging', 'Initial string value of my live data');
})
export default class MyFormViewModel extends ViewModel {
    constructor(reactObj, injectedDepencency) {
        super(reactObj, liveData);
        this.myDependency = injectedDepencency;
    }

    onSubmitClicked() {
        this.setLiveData(liveData.myLiveDataLabel, 'modified value');
        if(this.getLiveData(liveData.myLiveDataLabel) === 'Initial string value of my live data') {
            console.log('this wont print becuase you updated :)')
        }
        this.myDependency.serviceCallsOrWhateverNeeded(); //showing off injection of dependencies here
    }
}
```

REACT COMPONENT

``` javascript
import MyFormViewModel, { liveData as STATE } from './MyFormViewModel';

class MyComponent extends React.Component {
    componentDidMount(){
        this.myFormViewModel = new MyFormViewModel(this, new DependencyToInject())
     }
     
     ...
     <div>{this.state[STATE.myLiveDataLabel]}</div>
     <Button onClick={()=>{this.myFormViewModel.onSubmitClicked()}} >
}
```

# Writing Unit Tests

Using the `react-scripts test`, you can mock out all dependencies and inject them into your ViewModel.

``` javascript
import { ReactStateComponentMock } from 'react-mvvm-view-model';
import MyFormViewModel, { liveData as STATE } from './MyFormViewModel';
test('FormViewModel close modal', async () => {
    //create mock service
    const mockedDependencyToInject = {
        serviceCallsOrWhateverNeeded: () => {
            console.log('mocked service call');
        }
    }
    const formViewModel = new MyFormViewModel(new ReactStateComponentMock(), mockedDependencyToInject);
    expect(formViewModel.getLiveData(STATE.myLiveDataLabel)).toBe('Initial string value of my live data');
    
    //click submit (mocking user interactions)
    formViewModel.onSubmitClicked();
    expect(formViewModel.getLiveData(STATE.myLiveDataLabel)).toBe('modified value');
});
```