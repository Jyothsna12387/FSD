  <template>
  <Navbar_student />
  <div class="room-application-container">
    <h1 class="application-title">Room Application</h1>
    <div class="form-container">
      <form @submit.prevent="submitApplication">
        <!-- ✅ Field ID -->
        <div class="form-group">
          <label for="fieldID">Field ID</label>
           <input type="text" id="fieldID" v-model="form.fieldID" @blur="getStudentName" @input="clearFieldIdError" placeholder="Enter your Field ID" required />
        <p v-if="errorMessage" class="field-error">{{ errorMessage }}</p>
          </div>

        <!-- Student Name -->
         <div class="form-group">
           <label for="studentName">Student Name:</label>
           <input type="text" id="studentName" v-model="form.studentName" readonly required/>
         </div>


        <!-- Room Type & AC Type (Side by side) -->
        <div class="form-row">
          <div class="form-group">
            <label for="roomType">Room Type</label>
            <select id="roomType" v-model="form.roomType" required>
              <option value="">Select</option>
              <option>Single Occupancy</option>
              <option>Double Occupancy</option>
              <option>Triple Occupancy</option>
              <option>Shared with 4 members</option>
              <option>Shared with 5 members</option>
            </select>
          </div>
          <div class="form-group">
            <label for="roomACType">AC/Non-AC</label>
            <select id="roomACType" v-model="form.roomACType" required>
              <option value="">Select</option>
              <option>AC</option>
              <option>Non-AC</option>
            </select>
          </div>
        </div>

        <!-- Contact Numbers -->
        <div class="form-row">
          <div class="form-group">
            <label for="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              v-model="form.contactNumber"
              placeholder="Enter your number"
              required
            />
          </div>
          <div class="form-group">
            <label for="parentMobile">Parent's Mobile Number</label>
            <input
              type="tel"
              id="parentMobile"
              v-model="form.parentMobile"
              placeholder="Enter parent’s number"
              required
            />
          </div>
        </div>

        <!-- Agreement Checkbox -->
        <div class="form-group checkbox-group">
          <input
            type="checkbox"
            id="agreeRules"
            v-model="form.agreedToRules"
            required
          />
          <label for="agreeRules">I agree to the hostel rules and regulations</label>
        </div>

 <!-- Success Modal -->
<div v-if="successMessage" class="modal-overlay">
  <div class="modal-content">
    <p>{{ successMessage }}</p>
    <button class="close-button" @click="successMessage = ''">OK</button>
  </div>
</div>

        <!-- Buttons -->
        <div class="form-actions">
          <button type="submit" class="submit-btn">Submit Application</button>
          <router-link to="/student-dashboard" class="back-btn">←  Back to Dashboard</router-link>
        </div>
      </form>
    </div>
  </div>
  <Footer />
</template>

<script>
import axios from 'axios';
import Navbar_student from '@/components/Navbar_student.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: { Navbar_student, Footer },
  data() {
    return {
      form: {
        fieldID: '',
        studentName: '',
        roomType: '',
        roomACType: '',
        contactNumber: '',
        parentMobile: '',
        agreedToRules: false
      },
       successMessage: '',   
      errorMessage: '' 
    };
  },
  methods: {
     async getStudentName() {
  try {
    if (!this.form.fieldID.trim()) {
      this.errorMessage = 'Field ID cannot be empty.';
      this.form.studentName = '';
      return;
    }

    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/v1/room-application/name/${this.form.fieldID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data.name) {
      this.form.studentName = res.data.name;
      this.errorMessage = ''; // ✅ clear error
    } else {
      this.form.studentName = '';
      this.errorMessage = 'No student found with this Field ID.';
    }
  } catch (err) {
    this.form.studentName = '';
    this.errorMessage = 'Unable to fetch student name. Please check your Field ID.';
  }
},
 
async submitApplication() {
  try {
    const token = localStorage.getItem('token');

    await axios.post(
      'http://localhost:5000/api/v1/room-application',
      this.form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    this.successMessage = 'Room application submitted successfully!';
    this.errorMessage = '';
    this.resetForm();

    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  } catch (err) {
    this.errorMessage = err.response?.data?.message || 'Failed to submit application.';
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
},

    resetForm() {
      this.form = {
        fieldID: '',
        studentName: '',
        roomType: '',
        roomACType: '',
        contactNumber: '',
        parentMobile: '',
        agreedToRules: false
      };
    },
    clearFieldIdError() {
  this.errorMessage = '';
  this.form.studentName = '';
}

  },

  watch: {
  'form.fieldID'(newVal) {
    this.errorMessage = '';
    this.form.studentName = '';
    if (newVal && newVal.trim().length >= 4) {
      this.getStudentName();
    }
  }
}
};
</script>


 <style scoped>
.room-application-container {
  width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.application-title {
  text-align: center;
  font-size: 30px;
  color: #1BBC9B;
  margin-bottom: 25px;
  font-weight: 600;
}

.form-container {
  display: flex;
  flex-direction: column;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #1f2937;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #1BBC9B;
  border-radius: 8px;
  font-size: 15px;
  transition: border 0.3s ease;
}

input:focus,
select:focus {
  border-color: #1BBC9B;
  outline: none;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.submit-btn {
  padding: 12px;
  background-color: #1BBC9B;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 19px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}
.form-actions{
  display:flex;
  flex-direction: column;
  gap:20px;
  align-items: center;
}

.submit-btn:hover {
  background-color: #1BBC9B;
}

.back-btn {
  display: inline-block;
  margin-top: 15px;
  text-align: center;
  color: #1BBC9B;
  font-size: 18px;
  text-decoration: none;
 }

.back-btn:hover{
  text-decoration: underline;
}

.success-message {
  color: #1BBC9B;
  margin-bottom: 10px;
  font-size: 17px;
  text-align: center;
}

.error-message {
  color: red;
  margin-bottom: 10px;
  font-size: 17px;
  text-align: center;
}

.field-error {
  color: red;
  font-size: 15px;
  margin-top: 5px;
  margin-left: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
}

.modal-content p {
  color: #1BBC9B;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
}

.close-button {
  background-color: #1BBC9B;
  color: white;
  border: none;
  padding: 10px 18px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #17a589;
}


</style>
