import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import '@testing-library/jest-dom';
import { AppRouter } from '../../components/router/AppRouter';


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );
// const initState = {
//     auth: {
//         checking: true
//     }
// };
// let store = mockStore( initState );
// store.dispatch = jest.fn();

describe('Pruebas en <AppRouter /> ', () => {
    
    test('Debe mostrar el h5 inicial.', () => {
        const initState = {
            auth: {
                checking: true
            }
        };
        let store = mockStore( initState );
        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );
        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('h5').exists() ).toBe( true );
    });
    test('Debe mostrar la PublicRoute.', () => {
        const initState = {
            auth: {
                checking: false,
                uid: null
            }
        };
        let store = mockStore( initState );
        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );
        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('.login-container').exists() ).toBe( true );
    });
    test('Debe mostrar la PrivateRoute.', () => {
        const initState = {
            ui:{
                modalOpen: false
            },
            calendar:{
                events: []
            },
            auth: {
                checking: false,
                uid: '123',
                name: 'Ramoncete'
            }
        };
        let store = mockStore( initState );
        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );
        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('.calendar-screen').exists() ).toBe( true );
    });
    
})
