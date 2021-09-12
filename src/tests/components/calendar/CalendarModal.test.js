import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import '@testing-library/jest-dom';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import moment from 'moment';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../../actions/events';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';

jest.mock('../../../actions/events', () => ({
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn(),
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn()
    
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))

Storage.prototype.setItem = jest.fn();

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const now = moment().minute(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'test',
            notes: 'test',
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    auth: {
        uid: '123',
        name: 'Ramon'
    },
    ui: {
        modalOpen: true
    }
};
let store = mockStore( initState );

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarModal />
    </Provider>
)

describe('Pruebas en el <CalendarModal />', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    })
    test('Debe mostrar el modal', () => {
        // expect( wrapper.find('.modal').exists() ).toBe( true );
        expect( wrapper.find('Modal').prop('isOpen') ).toBe( true );
    });

    test('Debe llamar la acción de actualizar y cerrar Modal', () => {
        
        wrapper.find('form').simulate( 'submit', {
            preventDefault(){}
        });

        expect( eventStartUpdate ).toHaveBeenCalledWith( initState.calendar.activeEvent );
        expect( eventClearActiveEvent ).toHaveBeenCalled( );
    });
    
    test('Error si no hay titulo', () => {
        wrapper.find('form').simulate( 'submit', {
            preventDefault(){}
        });
        expect( wrapper.find('input[name="title"]').hasClass('is-invalid') ).toBe( true );
    });

    test('Debe crear un nuevo evento', () => {
        const initState = {
            calendar: {
                events: [],
                activeEvent: null
            },
            auth: {
                uid: '123',
                name: 'Ramon'
            },
            ui: {
                modalOpen: true
            }
        };
        
        const store = mockStore( initState );
        store.dispatch = jest.fn();
        
        const wrapper = mount(
            <Provider store={ store }>
                <CalendarModal />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola test'
            }
        });

        wrapper.find('form').simulate( 'submit', {
            preventDefault(){}
        });

        expect( eventStartAddNew ).toHaveBeenCalledWith( {
            end: expect.anything(),
            start: expect.anything(),
            notes: '',
            title: 'Hola test'
        });

        expect( eventClearActiveEvent ).toHaveBeenCalled( );
    });

    test('Validar fechas', () => {
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola test'
            }
        });
        
        const today = new Date();
        act( () => {
            wrapper.find('DateTimePicker').at(1).prop('onChange')(today);
        });
        wrapper.find('form').simulate( 'submit', {
            preventDefault(){}
        });

        expect( Swal.fire ).toHaveBeenCalledWith("Error", "La fecha fin debe ser superior a la fecha de inicio", "error");
    })

})
