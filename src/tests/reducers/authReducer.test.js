import { startLogin } from "../../actions/auth";
import { authReducer } from "../../reducers/authReducer"
import { types } from "../../types/types";

const initState = {
    checking: true,
    // uid: null,
    // name: null
}

describe('Pruebas en el authReducer', () => {
    test('Debe retornar el initState', () => {
        const state = authReducer( initState, {} );
        expect( state ).toEqual( initState );
    });
    
    test('Debe autenticar al usuario', () => {
        const action = {
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Ramon'
            }
        }
        const state = authReducer( initState, action );
        expect( state ).toEqual({ checking: false, uid: '123', name: 'Ramon' });
    });

    test('Debe finalizar el checking del login', () => {
        const action = {
            type: types.authCheckingFinish
        }
        const state = authReducer( initState, action );
        expect( state ).toEqual( { checking: false } );
    })
    
    test('Debe asegurar el checking a false en logout', () => {
        const action = {
            type: types.authLogout
        }
        const state = authReducer( initState, action );
        expect( state ).toEqual( { checking: false } );
    })
})
