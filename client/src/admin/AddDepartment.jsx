import { useState, useEffect } from "react";
import axios from "axios";

export default function AddDepartment() {

    const [form, setForm] = useState({ name: "", hod: "", location: "", contact: "" });
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const token = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    const load = async () => {
        const res = await axios.get("/api/departments");
        setData(res.data);
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        if (editingId) {
            await axios.put(`http://localhost:5000/api/departments/${editingId}`, form, token);
            setEditingId(null);
        } else {
            await axios.post("http://localhost:5000/api/departments", form, token);
        }

        setForm({ name: "", hod: "", location: "", contact: "" });
        load();
    };

    const edit = (dept) => {
        setForm(dept);
        setEditingId(dept._id);
    };

    const del = async (id) => {
        await axios.delete(`http://localhost:5000/api/departments/${id}`, token);
        load();
    };

    return (
        <div>

            {/* 🔹 Form */}
            <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4
                     text-slate-800 dark:text-slate-100">
                    {editingId ? "Edit Department" : "Add Department"}
                </h3>

                <div className="flex flex-wrap gap-3">

                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800
                     border-slate-300
                     dark:bg-slate-800 dark:text-slate-100
                     dark:border-slate-600
                     placeholder-slate-400 dark:placeholder-slate-500"
                    />

                    <input
                        placeholder="HOD"
                        value={form.hod}
                        onChange={e => setForm({ ...form, hod: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800
                     border-slate-300
                     dark:bg-slate-800 dark:text-slate-100
                     dark:border-slate-600
                     placeholder-slate-400 dark:placeholder-slate-500"
                    />

                    <input
                        placeholder="Location"
                        value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800
                     border-slate-300
                     dark:bg-slate-800 dark:text-slate-100
                     dark:border-slate-600
                     placeholder-slate-400 dark:placeholder-slate-500"
                    />

                    <input
                        placeholder="Contact Email"
                        value={form.contact}
                        onChange={e => setForm({ ...form, contact: e.target.value })}
                        className="px-4 py-2 rounded-lg border
                     bg-white text-slate-800
                     border-slate-300
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
                            <th className="p-3 text-center">HOD</th>
                            <th className="p-3 text-center">Location</th>
                            <th className="p-3 text-center">Contact</th>
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
                                    {d.hod}
                                </td>

                                <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                                    {d.location}
                                </td>

                                <td className="p-3 text-center text-slate-800 dark:text-slate-200">
                                    {d.contact}
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