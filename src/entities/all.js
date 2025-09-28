// // Mock entity implementations for development
// // Replace with actual API calls in production

// class EntityBase {
//   constructor(name) {
//     this.name = name;
//     this.storage = `${name}_data`;
//   }

//   async list(orderBy = '', limit = 50) {
//     const data = JSON.parse(localStorage.getItem(this.storage) || '[]');
//     return data.slice(0, limit);
//   }

//   async create(data) {
//     const items = JSON.parse(localStorage.getItem(this.storage) || '[]');
//     const newItem = {
//       ...data,
//       id: Date.now().toString(),
//       created_date: new Date().toISOString()
//     };
//     items.unshift(newItem);
//     localStorage.setItem(this.storage, JSON.stringify(items));
//     return newItem;
//   }

//   async update(id, data) {
//     const items = JSON.parse(localStorage.getItem(this.storage) || '[]');
//     const index = items.findIndex(item => item.id === id);
//     if (index !== -1) {
//       items[index] = { ...items[index], ...data };
//       localStorage.setItem(this.storage, JSON.stringify(items));
//       return items[index];
//     }
//     return null;
//   }
// }

// export const Lead = new EntityBase('Lead');
// export const Activity = new EntityBase('Activity');

// src/entities/all.js
import { sampleLeads, sampleActivities } from '../lib/sampleData.jsx';

class EntityBase {
  constructor(name, sampleData = []) {
    this.name = name;
    this.storage = `${name}_data`;
    // Initialize with sample data if localStorage is empty
    if (!localStorage.getItem(this.storage)) {
      localStorage.setItem(this.storage, JSON.stringify(sampleData));
    }
  }

  async list(orderBy = '', limit = 50) {
    const data = JSON.parse(localStorage.getItem(this.storage) || '[]');
    return data.slice(0, limit);
  }

  async create(data) {
    const items = JSON.parse(localStorage.getItem(this.storage) || '[]');
    const newItem = {
      ...data,
      id: Date.now().toString(),
      created_date: new Date().toISOString()
    };
    items.unshift(newItem);
    localStorage.setItem(this.storage, JSON.stringify(items));
    return newItem;
  }

  async update(id, data) {
    const items = JSON.parse(localStorage.getItem(this.storage) || '[]');
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data };
      localStorage.setItem(this.storage, JSON.stringify(items));
      return items[index];
    }
    return null;
  }
}

export const Lead = new EntityBase('Lead', sampleLeads);
export const Activity = new EntityBase('Activity', sampleActivities);