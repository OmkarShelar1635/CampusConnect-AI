
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddFaculty() {

    const [form, setForm] = useState({ name: "", department: "", designation: "", email: "" });
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const token = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    const load = async () => {
        const res = await axios.get("/api/faculty");
        setData(res.data);
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        if (editingId) {
            await axios.put(`http://localhost:5000/api/faculty/${editingId}`, form, token);
            setEditingId(null);
        } else {
            await axios.post("http://localhost:5000/api/faculty", form, token);
        }

        setForm({ name: "", department: "", designation: "", email: "" });
        load();
    };

    const edit = (fcuty) => {
        setForm(fcuty);
        setEditingId(fcuty._id);
    };

    const del = async (id) => {
        await axios.delete(`http://localhost:5000/api/faculty/${id}`, token);
        load();
    };

    return (
        <div>

            {/* 🔹 Form */}
            <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4
                     text-slate-800 dark:text-slate-100">
                    {editingId ? "Edit Faculty" : "Add Faculty"}
                </h3>

                <div className="flex flex-wrap gap-3">

                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800 border-slate-300
                     dark:bg-slate-800 dark:text-slate-100
                     dark:border-slate-600
                     placeholder-slate-400 dark:placeholder-slate-500"
                    />

                    <input
                        placeholder="Department"
                        value={form.department}
                        onChange={e => setForm({ ...form, department: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800 border-slate-300
                     dark:bg-slate-800 dark:text-slate-100
                     dark:border-slate-600
                     placeholder-slate-400 dark:placeholder-slate-500"
                    />

                    <input
                        placeholder="Designation"
                        value={form.designation}
                        onChange={e => setForm({ ...form, designation: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800 border-slate-300
                     dark:bg-slate-800 dark:text-slate-100
                     dark:border-slate-600
                     placeholder-slate-400 dark:placeholder-slate-500"
                    />

                    <input
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800 border-slate-300
                     dark:bg-slate-800 dark:text-slate-100
                     dark:border-slate-600
                     placeholder-slate-400 dark:placeholder-slate-500"
                    />

                    <button
                        onClick={save}
                        className="px-5 py-2 rounded-lg text-white
                     bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                        {editingId ? "Update" : "Add"}
                    </button>

                </div>
            </div>

            {/* 🔹 Table */}
            <div className="overflow-hidden rounded-xl border
                    border-slate-200 dark:border-slate-700">

                <table className="w-full text-sm">

                    <thead className="bg-slate-200 text-slate-800
                          dark:bg-slate-800 dark:text-slate-200">
                        <tr>
                            <th className="p-3 text-center">Name</th>
                            <th className="p-3 text-center">Department</th>
                            <th className="p-3 text-center">Designation</th>
                            <th className="p-3 text-center">Email</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map(d => (
                            <tr
                                key={d._id}
                                className="border-t border-slate-200 dark:border-slate-700
                         hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                                    {d.name}
                                </td>

                                <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                                    {d.department}
                                </td>

                                <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                                    {d.designation}
                                </td>

                                <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                                    {d.email}
                                </td>

                                <td className="p-3">
                                    <div className="flex justify-center gap-6">

                                        <button
                                            onClick={() => edit(d)}
                                            className="bg-amber-500 hover:bg-amber-600
                               text-white px-4 py-1 rounded transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => del(d._id)}
                                            className="bg-red-500 hover:bg-red-600
                               text-white px-4 py-1 rounded transition"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}