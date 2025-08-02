  <template>
  <Navbar_Student />
  <div class="request-container1">
    <div class="request-container">
      <div class="cards-wrapper">
        <!-- Complaint Form -->
        <div class="form-card">
          <h1 class="center-heading">Complaint Submission</h1>

          <div class="complaint-section">
            <div class="form-group">
              <label>Complaint Type:</label>
              <select v-model="complaintType" class="form-input">
                <option disabled value="">Select complaint type</option>
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>Furniture</option>
                <option>Cleaning</option>
                <option>Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>Description:</label>
              <textarea
                v-model="complaintDescription"
                placeholder="Please describe your complaint in detail..."
                rows="4"
                class="form-input"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Upload Photo (Optional):</label>
              <input type="file" @change="handleFileUpload" accept="image/*" class="form-input" />
            </div>

           <div class="submit-wrapper">
  <button @click="submitComplaint" class="submit-btn" :disabled="isSubmitting">
  {{ isSubmitting ? 'Submitting...' : 'Submit Complaint' }}
</button>
  <button @click="showHistory = true" class="history-btn">View History</button>
</div>

          </div>
        </div>    
      </div>
      </div>

    </div>

  <!-- ✅ Complaint History Modal -->
<div v-if="showHistory" class="modal-overlay">
  <div class="modal-content">
    <h2>Complaint History</h2>
    <button class="close-btn" @click="showHistory = false">&times;</button>

    <!-- No complaints -->
    <div v-if="complaints.length === 0" class="no-complaints">
      No complaints yet.
    </div>

    <!-- List of complaints -->
    <div v-else>
      <div
        class="complaint-card"
        :class="statusBorderClass(c.status)"
        v-for="(c, index) in complaints"
        :key="c._id"
      >
        <div class="complaint-row"><strong>Category:</strong> <span>{{ c.category }}</span></div>
        <div class="complaint-row"><strong>Description:</strong> <span>{{ c.description }}</span></div>
        <div class="complaint-row"><strong>Status:</strong> <span>{{ c.status }}</span></div>
        <div class="complaint-row"><strong>Date:</strong> <span>{{ formatDate(c.createdAt) }}</span></div>
      </div>
    </div>
  </div>
</div>


<!-- ✅ Add this block to show success/error popup -->
<div v-if="showResponseModal" class="modal-overlay">
  <div class="response-modal" :class="{ success: isSuccess, error: !isSuccess }">
    <h3>{{ isSuccess ? 'Success ✅' : 'Error ❌' }}</h3>
    <p>{{ responseMessage }}</p>
    <button @click="closeResponseModal">OK</button>
  </div>
</div>

  <Footer />
</template>

<script>
import Navbar_Student from '../../../../components/Navbar_Student.vue';
import Footer from '../../../../components/Footer.vue';
import axios from 'axios';

export default {
  name: 'ComplaintSystem',
  components: { Footer, Navbar_Student },
  data() {
    return {
      complaints: [],
      complaintType: '',
      complaintDescription: '',
      uploadedPhoto: null,
      statusStep: 1,
      currentComplaint: null,
      showHistory: false,
      showSuccessModal: false,
      responseMessage: '',
      isSuccess: false,
      isSubmitting: false,
    };
  },

  watch: {
  showHistory(newVal) {
    if (newVal) {
      document.body.style.overflow = 'hidden'; // Disable scroll
      this.fetchStudentComplaints(); // Fetch fresh data
    } else {
      document.body.style.overflow = ''; // Enable scroll again
    }
  }
},

  methods: {
    handleFileUpload(event) {
      this.uploadedPhoto = event.target.files[0];
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString('en-IN');
    },

  closeResponseModal() {
  this.showResponseModal = false;
  this.responseMessage = '';
  this.isSuccess = false;
},

    async fetchStudentComplaints() {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/v1/complaints/my', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    this.complaints = res.data.data;

    if (this.complaints.length > 0) {
      this.currentComplaint = this.complaints[0];

      switch (this.currentComplaint.status) {
        case 'In Progress':
          this.statusStep = 2;
          break;
        case 'Resolved':
          this.statusStep = 3;
          break;
        default:
          this.statusStep = 1;
      }
    }
  } catch (err) {
    console.error('❌ Error fetching student complaints:', err);
  }
},
    async submitComplaint() {
      this.isSubmitting = true;
      await this.$nextTick();

      const token = localStorage.getItem('token');

      if (!this.complaintType || !this.complaintDescription) {
        this.isSuccess = false;
        this.responseMessage = '⚠️ Please fill in all fields.';
        this.showResponseModal = true;
        this.isSubmitting = false; 
         return;
      }

      try {
        const formData = new FormData();
        formData.append('category', this.complaintType);
        formData.append('description', this.complaintDescription);

        if (this.uploadedPhoto) {
          formData.append('image', this.uploadedPhoto);
        }

        await axios.post('/api/v1/complaints', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        //  this.showResponseModal = true;
         this.isSuccess = true;
        this.responseMessage = '✅ Complaint submitted successfully!';
        this.resetComplaintForm();
        this.fetchStudentComplaints(); // Refresh list

        // Auto-close after 3 seconds
       setTimeout(() => {
              this.showResponseModal = false;
          }, 3000);
      } catch (err) {
        console.error('Complaint submission error:', err);
        // alert(err.response?.data?.message || 'Failed to submit complaint.');
        this.isSuccess = false;
       this.responseMessage = '❌ Failed to submit complaint. Please try again.';
       this.showResponseModal = true;        
      }
      finally {
    this.showResponseModal = true;
    setTimeout(() => {
  if (this.showResponseModal) {
    this.closeResponseModal();
  }
}, 3000);

    this.isSubmitting = false;
    }
  },

    resetComplaintForm() {
      this.complaintType = '';
      this.complaintDescription = '';
      this.uploadedPhoto = null;
    },

     statusBorderClass(status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'border-pending';
      case 'approved':
        return 'border-approved';
      case 'rejected':
        return 'border-rejected';
      default:
        return 'border-default';
    }
  },
  },
  mounted() {
    this.fetchStudentComplaints();
  }
};
</script>



<style scoped>
.request-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.center-heading {
  color: #1BBC9B;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  border-bottom: 2px solid #1BBC9B;
  padding-bottom: 10px;
}

.cards-wrapper {
  display: flex;
  gap: 30px;
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  padding: 30px;
  width:800px;
}

.form-card {
  flex: 1;
 
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.form-input:focus {
  border-color: #1BBC9B;
  outline: none;
  box-shadow: 0 0 0 2px rgba(27, 188, 155, 0.2);
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.request-container1 {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

padding: 3rem 2rem;
  background: linear-gradient(to bottom, 
    #e0f8f6 0%, 
    #f0fdfc 30%, 
    #ffffff 50%, 
    #f0fdfc 70%, 
    #e0f8f6 100%);
 position: relative;
  overflow: hidden;}

.step-content {
  padding-left: 20px;
}

.step-content h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.step-content p {
  margin: 0;
  color: #777;
}

.current-status {
  margin-top: 30px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.current-status h3 {
  margin-top: 0;
  color: #1BBC9B;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.submit-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.submit-btn {
  background: #1BBC9B;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 200px;
  margin-left: 50px;
}

.submit-btn:hover {
  background: #15967D;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 188, 155, 0.3);
}

@media (max-width: 992px) {
  .cards-wrapper {
    flex-direction: column;
  }
  
  .status-card {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .request-container {
    padding: 20px;
  }
  
  .form-card, .status-card {
    padding: 20px;
  }
}
.complaint-history {
  margin-top: 40px;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.history-heading {
  font-size: 22px;
  color: #1BBC9B;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.history-card {
  padding: 15px;
  margin-bottom: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  border-left: 5px solid #1BBC9B;
}

.complaint-image {
  margin-top: 10px;
  max-width: 100px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.complaint-history {
  margin-top: 40px;
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.complaint-history h2 {
  font-size: 26px;
  color: #1BBC9B;
  margin-bottom: 24px;
  font-weight: bold;
  text-align: left;
}

.complaint-card {
  background: #f9f9f9;
  padding: 20px 24px;
  margin-bottom: 20px;
  border-radius: 12px;
  border-left: 5px solid #1BBC9B;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.complaint-card:hover {
  transform: translateY(-2px);
  background: #f0fdfc;
}

.complaint-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
}

.complaint-row strong {
  width: 120px;
  font-weight: 600;
  color: #333;
}

.history-btn {
  background: #1BBC9B;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: 16px;
  margin-right: 80px;
}

.history-btn:hover {
  background: #15967D;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(27, 188, 155, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  max-height: 80vh;
  overflow-y: auto;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  position: relative;
}

.modal-content h2{
color:#1BBC9B;
text-align: center;
margin-bottom: 10px;
font-size: 27px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #888;
}

.complaint-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-left: 5px solid transparent;
}

/* Border colors based on status */
.border-pending {
  border-left-color: rgb(219, 229, 17); /* orange */
}

.border-approved {
  border-left-color: #1BBC9B; /* green */
}

.border-rejected {
  border-left-color: #e74c3c; /* red */
}

/* .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.success-modal {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.success-modal h3 {
  margin-bottom: 12px;
  color: #1BBC9B;
}

.success-modal p {
  margin-bottom: 20px;
  color: #444;
}

.success-modal button {
  background-color: #1BBC9B;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.success-modal button:hover {
  background-color: #17a589;
} */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.response-modal {
  background: #fff;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.response-modal.success h3 {
  color: #1BBC9B;
}

.response-modal.error h3 {
  color: #e74c3c;
}

.response-modal p {
  margin: 15px 0;
  color: #333;
}

.response-modal button {
  background-color: #1BBC9B;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.response-modal button:hover {
  background-color: #16a085;
}

.no-complaints {
  text-align: center;
  font-style: italic;
  color: #777;
  padding: 20px 0;
  font-size: 18px;
}

</style>
