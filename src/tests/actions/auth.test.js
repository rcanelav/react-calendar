import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import '@testing-library/jest-dom';
import { startChecking, startLogin, startRegister } from "../../actions/auth";
import Swal from "sweetalert2";
import * as fetchModule from '../../helpers/fetch';
import { types } from "../../types/types";

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );
const initState = {};
let store = mockStore( initState );

Storage.prototype.setItem = jest.fn();

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))

describe('Pruebas en las acciones de auth', () => {
    beforeEach( () => {
        store = mockStore( initState );
        jest.clearAllMocks();
    });

    test('startLogin ', async() => {
        await store.dispatch( startLogin('ramon@gmail.com', '123456') );
        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: '[auth] login',
            payload: { uid: expect.any(String), name: expect.any(String) }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith( 'token', expect.any(String) );
        expect( localStorage.setItem).toHaveBeenCalledWith( 'token-init-date', expect.any(Number) );

        // token = localStorage.setItem.mock.calls[0][1];
        // console.log( localStorage.setItem.mock.calls[0][1])
        
    });

    test('startLogin incorrecto', async() => {
        await store.dispatch( startLogin('ramon@gmail.com', '12345') );
        let actions = store.getActions();
        expect( actions ).toEqual([]);
        expect( Swal.fire ).toHaveBeenCalled();
        
        await store.dispatch( startLogin('ramon@gmail2.com', '123456') );
        expect( Swal.fire ).toHaveBeenCalledWith("Error", "El usuario no existe con ese email.", "error");
    });

    test('startRegister correcto', async() => {
        fetchModule.fetchWithoutToken = jest.fn( () => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'carlitos',
                    token: 'asd123asd123asd123'
                }
            }
        }));
        await store.dispatch( startRegister('test@test.com', '123456', 'test') );
        const actions = store.getActions();
        expect( actions[0] ).toEqual({ 
            type: '[auth] login',
            payload: {
                uid: '123',
                name: 'carlitos'
            } })
            expect( localStorage.setItem ).toHaveBeenCalledWith( 'token', 'asd123asd123asd123' );
            expect( localStorage.setItem).toHaveBeenCalledWith( 'token-init-date', expect.any(Number) );
    });

    test('startChecking correcto', async() => {
        fetchModule.fetchWithToken = jest.fn( () => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'carlitos',
                    token: 'asd123asd123asd123'
                }
            }
        }));
        await store.dispatch( startChecking() );
        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123', 
                name: 'carlitos' 
            }
        });
        expect( localStorage.setItem ).toHaveBeenCalledWith( 'token', 'asd123asd123asd123' );
    })
    
    
    
    
})
