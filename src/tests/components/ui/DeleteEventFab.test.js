import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import '@testing-library/jest-dom';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';
jest.mock('../../../actions/events', () => ({
    eventStartDelete: jest.fn()
}))

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );
const initState = {};
let store = mockStore( initState );

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <DeleteEventFab />
    </Provider>
)

describe('Pruebas en <DeleteEventFab />', () => {
    
    test('Debe mostrarse correctamente', () => {
        expect( wrapper ).toMatchSnapshot();
    });

    test('Debe llamar al eventStartDelete en click', () => {
        wrapper.find('button').simulate('click');
        expect( eventStartDelete ).toHaveBeenCalled();
    })
    
})
