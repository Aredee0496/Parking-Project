import axios from 'axios';
import { useEffect, useState } from 'react';
import { Modal, Button, Table, Input } from 'antd';

const ShuttleData = () => {
  const [shuttles, setShuttles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newShuttle, setNewShuttle] = useState({
    RegisterPlateNo: '',
    Type: ''
  });
  const [editShuttle, setEditShuttle] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/shuttles')
      .then(response => {
        setShuttles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching shuttles:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShuttle(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditShuttle(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/shuttles', newShuttle);
      setShuttles(prevShuttles => [...prevShuttles, response.data]);
      setShowAddModal(false);
      setNewShuttle({ RegisterPlateNo: '', Type: '' });
    } catch (error) {
      console.error('Error adding shuttle:', error);
      setError(error.response ? error.response.data.message : 'Error adding shuttle');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(`http://localhost:5000/api/shuttles/${editShuttle.Shuttle_ID}`, editShuttle);
      setShuttles(prevShuttles => {
        return prevShuttles.map(shuttle =>
          shuttle.Shuttle_ID === editShuttle.Shuttle_ID ? response.data : shuttle
        );
      });
      setShowEditModal(false);
      setEditShuttle(null);
    } catch (error) {
      console.error('Error updating shuttle:', error);
      setError(error.response ? error.response.data.message : 'Error updating shuttle');
    }
  };

  const handleDelete = async (shuttleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/shuttles/${shuttleId}`);
      setShuttles(prevShuttles => prevShuttles.filter(shuttle => shuttle.Shuttle_ID !== shuttleId));
    } catch (error) {
      console.error('Error deleting shuttle:', error);
      setError(error.response ? error.response.data.message : 'Error deleting shuttle');
    }
  };

  const openEditModal = (shuttle) => {
    setEditShuttle(shuttle);
    setShowEditModal(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Shuttle_ID',
      key: 'Shuttle_ID',
    },
    {
      title: 'Register Plate No',
      dataIndex: 'RegisterPlateNo',
      key: 'RegisterPlateNo',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, shuttle) => (
        <>
          <Button onClick={() => openEditModal(shuttle)} style={{ marginRight: 5 }}>Edit</Button>
          <Button onClick={() => handleDelete(shuttle.Shuttle_ID)} danger>Delete</Button>
        </>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {typeof error === 'string' ? error : error.message}</p>;

  return (
    <div className="table-container">
      <h1>Shuttle List</h1>
      <Button type="primary" onClick={() => setShowAddModal(true)} style={{ marginBottom: 16 }}>
        Add Shuttle
      </Button>
      
      <Modal
        title="Add Shuttle"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={handleAddSubmit}
      >
        <form>
          <label>
            Register Plate No:
            <Input
              type="text"
              name="RegisterPlateNo"
              value={newShuttle.RegisterPlateNo}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Type:
            <Input
              type="text"
              name="Type"
              value={newShuttle.Type}
              onChange={handleInputChange}
              required
            />
          </label>
        </form>
      </Modal>
      
      <Modal
        title="Edit Shuttle"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleEditSubmit}
      >
        <form>
          <label>
            ID:
            <Input
              type="text"
              name="Shuttle_ID"
              value={editShuttle?.Shuttle_ID || ''}
              onChange={handleEditChange}
              disabled
            />
          </label>
          <label>
            Register Plate No:
            <Input
              type="text"
              name="RegisterPlateNo"
              value={editShuttle?.RegisterPlateNo || ''}
              onChange={handleEditChange}
              required
            />
          </label>
          <label>
            Type:
            <Input
              type="text"
              name="Type"
              value={editShuttle?.Type || ''}
              onChange={handleEditChange}
              required
            />
          </label>
        </form>
      </Modal>

      <Table
        dataSource={shuttles}
        columns={columns}
        rowKey="Shuttle_ID"
        pagination={false}
      />
    </div>
  );
};

export default ShuttleData;
