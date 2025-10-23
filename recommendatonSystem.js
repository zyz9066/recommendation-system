// Simple product store using dictionary for O(1) lookups
// Pros: Constant Time Complexity --> lookups, adding, deleting
// Cons: Creating relationships, cannot create structure relationships
// Use case: Core inventory 
const products = {
  1: {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 1000,
    quantity: 5,
    popularity: 50,
  },
  2: {
    id: 2,
    name: "Phone",
    category: "Electronics",
    price: 800,
    quantity: 10,
    popularity: 100,
  },
  3: {
    id: 3,
    name: "Phone Case",
    category: "Accessories",
    price: 20,
    quantity: 50,
    popularity: 20,
  },
  4: {
    id: 4,
    name: "Charger",
    category: "Accessories",
    price: 25,
    quantity: 30,
    popularity: 70,
  },
};

// CRUD operations
function addProduct(product) {
  products[product.id] = product;
}

function updateProduct(id, updates) {
  if (products[id]) {
    products[id] = { ...products[id], ...updates };
  }
}

function deleteProduct(id) {
  delete products[id];
}

function searchProductByName(name) { // Time Complexity: O(n)
  return Object.values(products).filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase()) // case --> case, phone case, phonecase
  );
}

// ====================================
// For Trending Products
// Pros: Always gives the max --> meaning easily fetches the trending products
// Cons: Needs to be updated when the criteria; in this case popularity changes

class MaxHeap {
  constructor() {
    this.heap = [];
  }

  insert(product) {
    this.heap.push(product);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while(index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if(this.heap[index].popularity > this.heap[parent].popularity) {
            [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
            index = parent;
        }
        else {
            break;
        }
    }
  }

  extractMax() {
    if(this.heap.length === 0) return null;
    if(this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown(0);
    return max;
  }

  sinkDown(index) {
    let max = index;
    let n = this.heap.length;
    let left = 2 * index + 1;
    let right = 2 * index + 2;

    if(left < n && this.heap[left].popularity > this.heap[max].popularity) {
        max = left;
    }

    if(right < n && this.heap[right].popularity > this.heap[max].popularity) {
        max = right;
    }
    if(max === index) {
        return;
    } // this mean its already in the right place, its a valid heap

    [this.heap[max], this.heap[index]] = [this.heap[index], this.heap[max]];

    this.sinkDown(max);
    // index = max;
  }
}

const trending = new MaxHeap();
Object.values(products).forEach((p) => trending.insert(p));

console.log("Top trending:", trending.extractMax());

// =================================
// For Related Products By Category
// Pros: Simple relationship
// Cons: Too broad, many edges --> can improve this by graph --> weighted graph (purchase History) and heap --> minHeap (cheapestProducts)
const graph = {};
// Build graph by category
function buildGraphByCategory() {
    const categoryMap = {}

    // Group products by catgeory
    Object.values(products).forEach(p => {
        if(!categoryMap[p.category]) categoryMap[p.category] = [];
        categoryMap[p.category].push(p.id);
    });

    // Connect all the products that are in the same category
    for(let cat in categoryMap) {
        let prodIds = categoryMap[cat]; [1,2,3]
        // prodIds.forEach(id1 => {
        //     prodIds.forEach(id2 => {
        //         if(id1 !== id2) {
        //             if(!graph[id1]) graph[id1] = new Set();
        //             graph[id1].add(id2);
        //         }
        //     })
        // })

        
        for(let id of prodIds) { // O(n)
            if(!graph[id]) graph[id] = new Set();
            graph[id].add(prodIds.filter(i => i !== id)); // O(n)
        }
    }

}

buildGraphByCategory();
console.log("Graph:", graph);
