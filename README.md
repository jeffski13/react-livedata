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

Minimum code boiler plate for ViewModel: 

``` javascript
import ViewModel, { LiveData } from 'react-livedata';

export const liveData = Object.freeze({
    myLiveData: new LiveData('initval'),
});

export default class MyFormViewModel extends ViewModel {
    constructor(reactObj) {
        super(reactObj, liveData);
    }
}
```


# Example

ViewModel: MyFormViewModel.js

``` javascript
import ViewModel, { LiveData } from 'react-livedata';
//declare your livedata properties and initial/default property values here
export const liveData = Object.freeze({
    myLiveDataLabel: new LiveData('Initial string value of my live data', 'optionalKeyNameForDebugging'),
    myLiveDataWithNoOptionalPropertyName: new LiveData(0)
});

export default class MyFormViewModel extends ViewModel {
    constructor(reactObj, injectedLocalStorageDepencency) {
        super(reactObj, liveData);
        this.localStorageDependency = injectedLocalStorageDepencency;
    }

    onSubmitClicked() {
        this.setLiveData(liveData.myLiveDataLabel, 'modified value');
        if(this.getLiveData(liveData.myLiveDataLabel) === 'Initial string value of my live data') {
            console.log('this wont print becuase you updated :)')
        }
        this.localStorageDependency.setItem('someLocalStorageKey', 'Some Local Storage Value'); //showing off injection of dependencies here
    }

    someOtherMethod() {
        //if you need the value of your optionalKeyNameForDebugging, you can use the js Symbol API:
        //Example: key/value from local storage:
        let restorationValue = this.localStorageDependency.getItem(liveData.myLiveDataLabel.key.description);
    }
}
```

React Component

``` javascript
import React from 'react';
import MyFormViewModel, { liveData } from './MyFormViewModel';

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
        this.myFormViewModel = new MyFormViewModel(this, localStorage);
    }

    render() {
        return(<>
            <div>{this.state[liveData.myLiveDataLabel]}</div>
            <Button onClick={()=>{this.myFormViewModel.onSubmitClicked()}} >
        </>);
    }
     
}
```

Tests

Using the `react-scripts test`, you can mock out all dependencies and inject them into your ViewModel.

``` javascript
import { ReactStateComponentMock } from 'react-livedata';
import MyFormViewModel, { liveData } from './MyFormViewModel';
test('FormViewModel Example Test', async () => {
    //Mock your dependency
    class LocalStorageProviderMock extends LocalStorageProvider {
        constructor() {
            super()
            this.localStorage = {};
        }

        getItem(key) {
            return this.localStorage[key];
        }
        
        setItem(key, value) {
            this.localStorage[key] = value;
        }
    }
    
    const formViewModel = new MyFormViewModel(new ReactStateComponentMock(), new LocalStorageProviderMock());
    expect(formViewModel.getLiveData(liveData.myLiveDataLabel)).toBe('Initial string value of my live data');
    
    //click submit (mocking user interactions)
    formViewModel.onSubmitClicked();
    expect(formViewModel.getLiveData(liveData.myLiveDataLabel)).toBe('modified value');
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