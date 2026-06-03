<script setup lang="ts">
// import Navbar from '@/components/layout/Navbar.vue';

</script>

<template>
    <Navbar></Navbar>
    <!-- Banner -->
    <div class="banner-placeholder border-bottom">
        <p class="text-muted m-0">[ រូបភាព Banner គ្រឿងទេស និងអាហារប្រចាំថ្ងៃរបស់លោកអ្នក ]</p>
    </div>

    <!-- Content -->
    <div class="container my-5 py-4 bg-white rounded shadow-sm">
        <div class="row g-5">
            
            <!-- Form ផ្ញើសារ -->
            <div class="col-lg-6">
                <h2 class="fw-bold text-dark mb-2">ទំនាក់ទំនង</h2>
                <p class="text-muted mb-4">មានសំណួរ ឬត្រូវការជំនួយមែនទេ? ទាក់ទងមក «ពិភពទំនិញ» ឥឡូវនេះ!</p>
                
                <form>
                    <div class="mb-3">
                        <label for="name" class="form-label fw-semibold text-secondary">ឈ្មោះពេញ</label>
                        <input type="text" class="form-control py-2" id="name" placeholder="វាយបញ្ចូលឈ្មោះរបស់អ្នក">
                    </div>
                    <div class="mb-3">
                        <label for="contact" class="form-label fw-semibold text-secondary">លេខទូរស័ព្ទ ឬ អ៊ីមែល</label>
                        <input type="text" class="form-control py-2" id="contact" placeholder="ឧទាហរណ៍៖ 012345678 ឬ email@example.com">
                    </div>
                    <div class="mb-3">
                        <label for="orderNum" class="form-label fw-semibold text-secondary">លេខកុម្ម៉ង់អីវ៉ាន់ <span class="text-muted fw-normal">(បើមាន)</span></label>
                        <input type="text" class="form-control py-2" id="orderNum" placeholder="ឧទាហរណ៍៖ #10234">
                    </div>
                    <div class="mb-4">
                        <label for="message" class="form-label fw-semibold text-secondary">សាររបស់អ្នក</label>
                        <textarea class="form-control" id="message" rows="4" placeholder="សរសេរសំណួរ ឬបញ្ហារបស់អ្នកនៅទីនេះ..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary bg-primary w-100 py-2 fw-bold">
                        <i class="bi bi-send-fill me-2"></i>ផ្ញើសារ
                    </button>
                </form>
            </div>
            
            <!-- ព័ត៌មានផ្ទាល់ និងផែនទី -->
            <div class="col-lg-6">
                <div class="p-4 bg-light rounded h-100">
                    <h4 class="fw-bold text-dark mb-4">ព័ត៌មានទំនាក់ទំនងផ្ទាល់</h4>
                    
                    <div class="mb-4 d-flex align-items-start">
                        <div class="text-primary me-3 fs-4 pt-1">
                            <i class="bi bi-geo-alt-fill"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1">អាសយដ្ឋាន</h6>
                            <p class="text-muted m-0">រាជធានីភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា</p>
                        </div>
                    </div>
                    
                    <div class="mb-4 d-flex align-items-start">
                        <div class="text-primary me-3 fs-4 pt-1">
                            <i class="bi bi-telephone-fill"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1">លេខទូរស័ព្ទ</h6>
                            <p class="text-muted m-0">012 345 678 / 098 765 432</p>
                        </div>
                    </div>
                    
                    <div class="mb-4 d-flex align-items-start">
                        <div class="text-primary me-3 fs-4 pt-1">
                            <i class="bi bi-envelope-fill"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1">អ៊ីមែល</h6>
                            <p class="text-muted m-0">support@piphorn-tomninh.com</p>
                        </div>
                    </div>
                    
                    <div class="mb-4 d-flex align-items-start">
                        <div class="text-primary me-3 fs-4 pt-1">
                            <i class="bi bi-clock-fill"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1">ម៉ោងធ្វើការ</h6>
                            <p class="text-muted m-0">រៀងរាល់ថ្ងៃ (8:00 ព្រឹក - 8:00 យប់)</p>
                        </div>
                    </div>
                    
                    <!-- ផែនទីគំរូ Google Map -->
                    <div class="ratio ratio-16x9 rounded border overflow-hidden shadow-sm mt-2">
                        <iframe src="https://google.com" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
            
        </div>
    </div>

</template>

<style>
    body {
        font-family: 'Kantumruy Pro', sans-serif;
        background-color: #f8f9fa;
    }
    .banner-placeholder {
        background-color: #e9ecef;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
</style>