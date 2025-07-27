<template>
  <div>
    <Navbar_warden />
    <div class="approval-container">
      <h2 class="approval-title">Room Change Requests</h2>
      <div class="approval-cards">
<div v-for="request in requests" v-if="requests.status === 'Pending'" :key="request._id" class="request-card">
  <div class="request-content">
    <div class="request-details">
       <p><strong>Student:</strong> {{ request.studentId.name }}  <!--({{ request.studentId.email }}) --> </p>
      <p><strong>Preferred Block:</strong> {{ request.preferredBlock }}</p>
      <p><strong>Preferred Room:</strong> {{ request.preferredRoomNumber }}</p>
      <p><strong>Reason:</strong> {{ request.reason }}</p>
      <p>
         <strong>Status:</strong>
          <span :class="'status ' + request.status.toLowerCase()">{{ request.status }}</span>
      </p>
    </div>

    <div class="button-group" v-if="request.status === 'Pending'">
      <button @click="updateStatus(request._id, 'Approved')" class="approve-btn">Approve</button>
      <button @click="updateStatus(request._id, 'Rejected')" class="reject-btn">Reject</button>
    </div>
  </div>
</div>
<p v-else class="no-requests-message">No requests to be found.</p>
</div>
</div>
</div>
  
</template>

<script>
import Navbar_warden from '@/components/Navbar_Warden.vue';
import axios from 'axios';

 export default {
  name: 'RoomChangeApproval',
  components: { 
    Navbar_warden 
  },
  data() {
    return {
      requests: [],
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/v1/room-change', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.requests = res.data.requests;
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  },
  methods: {
    async updateStatus(id, newStatus) {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:5000/api/v1/room-change/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Refresh the requests
      const res = await axios.get('http://localhost:5000/api/v1/room-change', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.requests = res.data.requests;
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
    }
  }
}

};

</script>

<style scoped>
.approval-container {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.approval-title {
  color: #00b894;
  text-align: center;
  font-size: 35px;
  margin-bottom: 2rem;
  border-bottom: 3px solid #1BBC9B;
  padding-bottom: 10px;
  max-width: 800px;
  margin-left: 300px;
  margin-right: auto;
}

.approval-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-left: 0%;
}

.request-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 750px;
  transition: 0.3s ease;
  margin-left: 0px;
  line-height: 35px;
}

.request-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.request-details {
  flex: 1;
  line-height: 2;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 2rem;
  margin-top: 20px;
  margin-right: 20px;
}

.request-card:hover {
  transform: translateY(-5px);
}

.status {
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 8px;
}
 
.approve-btn,
.reject-btn {
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  width:120px;
  font-size: 20px;
  font-weight: 700;
  margin-top: 0;
}

.approve-btn {
  background-color: white;
  color: #1BBC9B;
  border: 2px solid #1BBC9B;
}

.reject-btn {
  background-color: white;
  color: #cf1635;
  border: 2px solid red;
}

.approve-btn:hover {
  background-color: #1BBC9B;
  color:white;
  border-style: none;

}

.reject-btn:hover {
  background-color: #c0392b;
  color:white;
  border-style: none;
}

.no-requests-message {
  text-align: center;
  font-size: 25px;
  color: #777;
  margin-top: 3rem;
  font-style: italic;
}

</style>
