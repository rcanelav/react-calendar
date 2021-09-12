import { fetchWithoutToken, fetchWithToken } from "../../helpers/fetch"


describe('Pruebas en el helper Fetch', () => {
    let token = '';
    test('FetchWithoutToken debe funcionar', async() => {
        const resp = await fetchWithoutToken( 'auth', {
            "email": "ramon@gmail.com",
            "password": "123456"
        }, 'POST' );

        expect( resp instanceof Response ).toBe(true);
        const body = await resp.json();
        expect( body.ok ).toBeTruthy();

        token = body.token;
    })
    test('FetchWithToken debe funcionar', async() => {
        localStorage.setItem( 'token', token );
        const resp = await fetchWithToken( 'events/613b3377d7ba2e1c80e00c05', {}, 'DELETE' );
        const body = await resp.json();
       
        expect( body.msg ).toBe( 'No existe evento con ese ID' );
    })
    
})
