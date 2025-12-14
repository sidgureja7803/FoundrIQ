/**
 * CreditPackage Model Stub
 * This is a placeholder for credit package management functionality
 * In production, this should be replaced with proper Appwrite database queries
 */

class CreditPackageStub {
  constructor(data) {
    Object.assign(this, data);
    this._id = Math.random().toString(36).substr(2, 9);
    this.createdAt = Date.now();
    this.isActive = true;
  }
  
  async save() {
    console.warn('CreditPackage.save called - returning mock data (stub implementation)');
    return this;
  }
  
  // Static stub methods to prevent crashes
  static async countDocuments() {
    console.warn('CreditPackage.countDocuments called - returning 0 (stub implementation)');
    return 0;
  }
  
  static async findByIdAndUpdate(id, update, options) {
    console.warn('CreditPackage.findByIdAndUpdate called - returning null (stub implementation)');
    return null;
  }
  
  static async findById(id) {
    console.warn('CreditPackage.findById called - returning null (stub implementation)');
    return null;
  }
  
  static async find(query) {
    console.warn('CreditPackage.find called - returning empty array (stub implementation)');
    return [];
  }
}

export default CreditPackageStub;
