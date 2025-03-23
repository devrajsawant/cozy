'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AppointmentPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState({ hour: '10', minute: '00' });
    const [appointment, setAppointment] = useState(null);

    // Load appointment from localStorage
    useEffect(() => {
        const savedAppointment = JSON.parse(localStorage.getItem('appointment'));
        if (savedAppointment) {
            const currentTime = new Date();
            const appointmentTime = new Date(savedAppointment.date);
            appointmentTime.setHours(savedAppointment.time.hour, savedAppointment.time.minute);

            // Remove appointment if it's in the past
            if (currentTime > appointmentTime) {
                localStorage.removeItem('appointment');
            } else {
                setAppointment(savedAppointment);
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !phone || !date || !time.hour || !time.minute) {
            console.log('All fields are required.');
            return;
        }

        const currentTime = new Date();
        const selectedTime = new Date(date);
        selectedTime.setHours(time.hour, time.minute);

        if (selectedTime < currentTime) {
            console.log("You can't select a past date or time.");
            return;
        }

        const appointmentData = { name, email, phone, date, time };
        localStorage.setItem('appointment', JSON.stringify(appointmentData));
        setAppointment(appointmentData);
        console.log('Appointment booked:', appointmentData);
    };

    const handleDelete = () => {
        localStorage.removeItem('appointment');
        setAppointment(null);
        console.log('Appointment deleted.');
    };

    return (
        <div className="min-h-screen flex items-top py-10 justify-center bg-[#F2F1ED]">
            <div className="w-full max-w-4xl flex">
                {/* Left Section - Image & Text */}
                <div className="w-1/2 flex flex-col justify-top items-center text-center p-6">
                    <div className="w-full h-80 bg-red-200 flex items-center justify-center">
                        <img src="https://i.pinimg.com/736x/be/c5/ca/bec5caad0daa8bcbaf3fc1a2e75e1449.jpg" alt="Appointment" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-xl font-semibold mt-4">Book Your Appointment</h2>
                    <p className="text-gray-600 mt-2">
                        Schedule your appointment with ease. Choose your date and time, 
                        and we'll handle the rest. Let’s make your experience seamless!
                    </p>
                </div>

                {/* Right Section - Form or Appointment Card */}
                <div className="w-1/2 p-6">
                    {!appointment ? (
                        <>
                            <h1 className="text-xl font-bold mb-6 text-gray-800">Book Skin Care Appointment With Us.</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Name</label>
                                    <input type="text" className="w-full px-3 py-1 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                                        value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Email</label>
                                    <input type="email" className="w-full px-3 py-1 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Phone Number</label>
                                    <input type="tel" className="w-full px-3 py-1 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                                        value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                                <div className="mb-4 flex space-x-4">
                                    <div>
                                        <label className="block text-gray-700">Date</label>
                                        <DatePicker
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            minDate={new Date()}
                                            className="w-full px-3 py-1 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Time</label>
                                        <div className="flex space-x-2">
                                            <select className="w-full px-3 py-1 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                                                value={time.hour}
                                                onChange={(e) => setTime({ ...time, hour: e.target.value })}
                                                required>
                                                {Array.from({ length: 12 }, (_, i) => 10 + i).map((hour) => (
                                                    <option key={hour} value={String(hour).padStart(2, '0')}>
                                                        {String(hour).padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </select>
                                            <select className="w-full px-3 py-1 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                                                value={time.minute}
                                                onChange={(e) => setTime({ ...time, minute: e.target.value })}
                                                required>
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <option key={i} value={String(i).padStart(2, '0')}>
                                                        {String(i).padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-[#ADA7A3] text-white py-2 hover:bg-[#ADA7A3]/90">
                                    Book Appointment
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="bg-white shadow-md rounded p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-2">Your Appointment</h2>
                            <p className="text-gray-600"><strong>Name:</strong> {appointment.name}</p>
                            <p className="text-gray-600"><strong>Email:</strong> {appointment.email}</p>
                            <p className="text-gray-600"><strong>Phone:</strong> {appointment.phone}</p>
                            <p className="text-gray-600"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                            <p className="text-gray-600"><strong>Time:</strong> {`${appointment.time.hour}:${appointment.time.minute}`}</p>
                            <button onClick={handleDelete} className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                                Cancel Appointment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
