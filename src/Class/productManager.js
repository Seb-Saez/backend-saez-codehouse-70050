import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productList = [];

        // verificar si existe el arch sino se crea
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.promises.access(this.path);
        } catch (error) {
            await fs.promises.writeFile(this.path, JSON.stringify({ data: [] }));
        }
    }

    async getProductById(id) {
        await this.getProductList();
        return this.productList.find(product => product.id == id);
    }

    async getProductList() {
        try {
            const list = await fs.promises.readFile(this.path, 'utf-8');
            this.productList = JSON.parse(list).data || [];
        } catch (error) {
            this.productList = []; // si no hay archivo, inicializar como un array vacío
        }
        return [...this.productList];
    }

    async addProduct(product) {
        await this.getProductList();

        const lastId = this.productList.length > 0 ? this.productList[this.productList.length - 1].id : 0;
        const newId = lastId + 1;

        const newProduct = { id: newId, ...product };

        this.productList.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));
    }

    async updateProduct(id, updatedFields) {
        await this.getProductList();

        const index = this.productList.findIndex(product => product.id == id);

        if (index !== -1) {
            const updatedProduct = { ...this.productList[index], ...updatedFields };
            this.productList[index] = updatedProduct;

            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));

            return updatedProduct;
        }

        return null; // si no encuentra el producto devuelve null
    }

    async deleteProduct(id) {
        await this.getProductList();

        const index = this.productList.findIndex(product => product.id == id);

        if (index !== -1) {
            const deletedProduct = this.productList.splice(index, 1)[0];

            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));

            return deletedProduct;
        }

        return null; // si no encuentra el producto devuelve null
    }
}

export default ProductManager;
