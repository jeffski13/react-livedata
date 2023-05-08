# React with ViewModels and LiveData

This lightweight module will allow for MVVM architecture development inside of the React Framework. This was designed to work with [create-react-app](https://create-react-app.dev/).

The architecture was inspired by benefits seen in the native Android development environment with Viewmodels/LiveData.

# Getting Started

``` bash
npm install --save react-livedata 
```

Skip to example section below for code implementation.

Your JS Viewmodel class can extend the [ViewModel](./index.js). Your Viewmodel's constructor needs to be called with the react component whose state we are modeling. Your react component will create a reference to your viewmodel. That reference can be used throughout the lifecycle of the component, i.e. inside the component's render method.

In your tests you can create your same ViewModel class with a mocked react component using the [ReactStateComponentMock](./index.js).

# Example


ViewModel: MyFormViewModel.js

``` javascript
import ViewModel, { LiveData } from 'react-livedata';
//declare your livedata properties and initial/default property values here
export const liveData = Object.freeze({
    myLiveDataLabel: new LiveData('optionalKeyNameForDebugging', 'Initial string value of my live data');
});

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

React Component

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

Tests

Using the `react-scripts test`, you can mock out all dependencies and inject them into your ViewModel.

``` javascript
import { ReactStateComponentMock } from 'react-livedata';
import MyFormViewModel, { liveData as STATE } from './MyFormViewModel';
test('FormViewModel Example Test', async () => {
    //Mock your dependency
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

# Pros

- Faster test times: No browser (headless or otherwise) needed to run tests.
- Business logic can be taken out of the view layer and relocated into a dependency-injectable, testable class.

# Cons

- Initial properties based on variables need to be set in the constructor, away from the declaration. For Example:

``` javascript
constructor(reactObj, injectedDepencency) {
    super(reactObj, liveData);
    const conf = getConfig();
    this.setLiveData(liveData.myLiveDataLabel, conf.someConfigRelatedValue);
}
```

- A little wordy on imports and get/set statements.