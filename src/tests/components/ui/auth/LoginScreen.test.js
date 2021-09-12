import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import '@testing-library/jest-dom';
import { LoginScreen } from '../../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../../actions/auth';
import Swal from 'sweetalert2';
jest.mock('../../../../actions/auth', () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn()
}));
jest.mock('sweetalert2', () => ({
   fire: jest.fn()
}));


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );
const initState = {};
let store = mockStore( initState );
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <LoginScreen />
    </Provider>
);

describe('Pruebas en <LoginScreen />', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });
    
    test('Debe mostrarse correctamente', () => {
        
        expect( wrapper ).toMatchSnapshot();
    });

    test('Debe llamar al dispatch del login', () => {
        wrapper.find('input[name="lEmail"]').simulate( 'change', {
            target: {
                name: 'lEmail',
                value: 'beto@gmail.com'
            }
        });
        
        wrapper.find('input[name="lPassword"]').simulate( 'change', {
            target: {
                name: 'lPassword',
                value: '123456'
            }
        });

        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault(){}
        });

        expect( startLogin ).toHaveBeenCalledWith("beto@gmail.com", "123456");
    });
    
    test('No debe haber registro si las contraseñas no coinciden', () => {
        wrapper.find('input[name="rPassword1"]').simulate( 'change', {
            target: {
                name: 'rPassword1',
                value: '12345'
            }
        });
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        });
        expect( startRegister ).not.toHaveBeenCalled();
        expect( Swal.fire ).toHaveBeenCalledWith("Error", "Las contraseñas deben ser iguales.", "error");
    });

    test('Debe disparar el startRegister', () => {
        wrapper.find('input[name="rEmail"]').simulate( 'change', {
            target: {
                name: 'rEmail',
                value: 'beto@gmail.com'
            }
        });
        wrapper.find('input[name="rPassword1"]').simulate( 'change', {
            target: {
                name: 'rPassword1',
                value: '123456'
            }
        });
        wrapper.find('input[name="rPassword2"]').simulate( 'change', {
            target: {
                name: 'rPassword2',
                value: '123456'
            }
        });
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        });
        
        expect( startRegister ).toHaveBeenCalledWith("beto@gmail.com", "123456", "Ramon");
        expect( Swal.fire ).not.toHaveBeenCalled();
    });
    
})
