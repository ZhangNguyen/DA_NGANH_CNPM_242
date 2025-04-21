import React, { useState } from "react";

const ManagePlant = () => {
  const [plants, setPlants] = useState([
    { id: 1, name: "Cây Xanh", status: "Tốt", updatedAt: new Date().toLocaleString() },
    { id: 2, name: "Cây Đỏ", status: "Héo", updatedAt: new Date().toLocaleString() },
    { id: 3, name: "Cây Xương Rồng", status: "Tốt", updatedAt: new Date().toLocaleString() },
    { id: 4, name: "Cây Lá Kim", status: "Tốt", updatedAt: new Date().toLocaleString() },
    { id: 5, name: "Cây Hoa Hồng", status: "Héo", updatedAt: new Date().toLocaleString() },
    { id: 6, name: "Cây Sen Đá", status: "Tốt", updatedAt: new Date().toLocaleString() },
    { id: 7, name: "Cây Lúa", status: "Tốt", updatedAt: new Date().toLocaleString() },
    { id: 8, name: "Cây Mía", status: "Héo", updatedAt: new Date().toLocaleString() },
    { id: 9, name: "Cây Thông", status: "Tốt", updatedAt: new Date().toLocaleString() },
    { id: 10, name: "Cây Cau", status: "Tốt", updatedAt: new Date().toLocaleString() },
    { id: 11, name: "Cây Tre", status: "Héo", updatedAt: new Date().toLocaleString() },
  ]);

  const [search, setSearch] = useState("");
  const [editPlant, setEditPlant] = useState<Plant | null>(null);
  const [newPlant, setNewPlant] = useState({ name: "", status: "Tốt" });
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 7;
  const totalPages = Math.ceil(plants.length / plantsPerPage);

  const currentPlants = plants
    .filter((plant) => plant.name.toLowerCase().includes(search.toLowerCase()))
    .slice((currentPage - 1) * plantsPerPage, currentPage * plantsPerPage);

  const addPlant = () => {
    if (!newPlant.name.trim()) return;
    setPlants([...plants, { id: plants.length + 1, name: newPlant.name.trim(), status: newPlant.status, updatedAt: new Date().toLocaleString() }]);
    setNewPlant({ name: "", status: "Tốt" });
  };

  const removePlant = (id: number): void => {
    setPlants(plants.filter((plant: Plant) => plant.id !== id));
  };

  interface Plant {
    id: number;
    name: string;
    status: string;
    updatedAt: string;
  }

  const updatePlant = (id: number, newName: string, newStatus: string): void => {
    setPlants(plants.map((plant: Plant) => (plant.id === id ? { ...plant, name: newName, status: newStatus, updatedAt: new Date().toLocaleString() } : plant)));
    setEditPlant(null);
  };

  // Functions to handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Quản Lý Cây Trồng</h2>
      
      <input
        type="text"
        placeholder="Tìm kiếm cây..."
        className="border border-gray-300 px-4 py-2 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Nhập tên cây mới..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          value={newPlant.name}
          onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
        />
        <select
          value={newPlant.status}
          onChange={(e) => setNewPlant({ ...newPlant, status: e.target.value })}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        >
          <option value="Tốt">Tốt</option>
          <option value="Héo">Héo</option>
        </select>
        <button
          onClick={addPlant}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Thêm
        </button>
      </div>
      
      <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border p-3">STT</th>
            <th className="border p-3">Tên Cây</th>
            <th className="border p-3">Trạng Thái</th>
            <th className="border p-3">Cập Nhật</th>
            <th className="border p-3">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentPlants.map((plant, index) => (
            <tr key={plant.id} className="text-center hover:bg-gray-50 transition">
              <td className="border p-3">{(currentPage - 1) * plantsPerPage + index + 1}</td>
              <td className="border p-3 font-medium text-gray-800">{plant.name}</td>
              <td className="border p-3">
                {editPlant?.id === plant.id ? (
                  <select value={editPlant.status} onChange={(e) => setEditPlant({ ...editPlant, status: e.target.value })}>
                    <option value="Tốt">Tốt</option>
                    <option value="Héo">Héo</option>
                  </select>
                ) : (
                  plant.status
                )}
              </td>
              <td className="border p-3">{plant.updatedAt}</td>
              <td className="border p-3">
                <button onClick={() => updatePlant(plant.id, plant.name, plant.status)} className="bg-blue-500 text-white px-4 py-1 rounded-lg">Lưu</button>
                <button onClick={() => removePlant(plant.id)} className="ml-2 bg-red-500 text-white px-4 py-1 rounded-lg">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination controls */}
      <div className="mt-6 flex justify-center space-x-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg shadow-md ${currentPage === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Trang Trước
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded-lg">Trang {currentPage} / {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg shadow-md ${currentPage === totalPages ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Trang Sau
        </button>
      </div>
    </div>
  );
};

export default ManagePlant;