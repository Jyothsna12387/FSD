  <template>
  <Navbar_student />

  <div class="room-application-container">
    <h1 class="application-title">Room Application</h1>

    <form @submit.prevent="submitApplication" class="application-form">
      <!-- Building and Room Type -->
      <div class="form-row">
        <div class="form-group">
          <label>Preferred Building:</label>
          <select v-model="form.preferredBuilding" required>
            <option disabled value="">Select Building</option>
            <option>Building A</option>
            <option>Building B</option>
            <option>Building C</option>
          </select>
        </div>

        <div class="form-group">
          <label>Room Type:</label>
          <select v-model="form.roomType" required>
            <option disabled value="">Select Room Type</option>
            <option>Single Occupancy</option>
            <option>Double Occupancy</option>
            <option>Shared 4 Persons</option>
          </select>
        </div>
      </div>

      <!-- Roommates & Special Requirements -->
      <div class="form-row">
        <div class="form-group">
          <label>Preferred Roommates (if any):</label>
          <input
            v-model="form.preferredRoommates"
            placeholder="Enter student IDs separated by commas"
          />
        </div>

        <div class="form-group">
          <label>Special Requirements:</label>
          <textarea
            v-model="form.specialRequirements"
            placeholder="Any medical conditions or special needs"
          ></textarea>
        </div>
      </div>

      <!-- Rules Agreement and Button -->
      <div class="form-checkbox">
        <input type="checkbox" v-model="form.agreedToRules" required />
        <label>I agree to the hostel rules and regulations</label>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Submit Application</button>
        <router-link to="/student-dashboard" class="back-link">← Back to Dashboard</router-link>
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar_student from '@/components/Navbar_student.vue';

export default {
  components: { Navbar_student },
  data() {
    return {
      form: {
        preferredBuilding: '',
        roomType: '',
        preferredRoommates: '',
        specialRequirements: '',
        agreedToRules: false,
      },
      errorMsg: '',
      successMsg: '',
    };
  },
  methods: {
    async submitApplication() {
      try {
        // Extract token from localStorage (assumes you stored it after login)
        const token = localStorage.getItem('token');

        const response = await axios.post(
          'http://localhost:5000/api/v1/room-application',
          {
            ...this.form,
            preferredRoommates: this.form.preferredRoommates
              .split(',')
              .map((id) => id.trim()), // Convert to array
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.successMsg = 'Room application submitted successfully!';
        this.errorMsg = '';
        this.resetForm();
      } catch (err) {
        this.errorMsg =
          err.response?.data?.message || 'Failed to submit application.';
        this.successMsg = '';
      }
    },
    resetForm() {
      this.form = {
        preferredBuilding: '',
        roomType: '',
        preferredRoommates: '',
        specialRequirements: '',
        agreedToRules: false,
      };
    },
  },
};
</script>

<style scoped>
/* Add your styling or reuse existing form styles */
.room-application-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 1000px;
}

.back-nav {
  margin-bottom: 20px;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: #1bbc9b;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #e6fffb;
}

.application-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 26px;
}

.application-form {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-row {
  display: flex;
  gap: 24px;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.form-group {
  flex: 0 0 48%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group.full-width {
  flex: 0 0 100%;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-wrapper {
  margin-top: -10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 15px;
  color: #444;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
  margin-left: 270px;
  gap:20px;
}

.submit-btn {
  background-color: #1bbc9b;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width:220px;
  transition: background-color 0.2s ease-in-out;
}

.submit-btn:hover {
  background-color: #17a689;
}
.error-msg {
  color: red;
  text-align: center;
  font-size: 17px;
}
.success-msg {
  color: green;
  text-align: center;
  font-size: 17px;
}
</style>
