"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = getAllCategories;
exports.getAllCategoriesById = getAllCategoriesById;
const dal_1 = require("../dal/dal");
const CategoryModel_1 = require("../models/CategoryModel");
function buildHierarchy(categories) {
    const categoryMap = new Map();
    const rootCategories = [];
    categories.forEach(cat => {
        const hierarchyItem = {
            id: cat.id,
            name: cat.name,
            parentId: cat.parentId,
            children: []
        };
        categoryMap.set(cat.id, hierarchyItem);
    });
    categories.forEach(category => {
        if (category.parentId) {
            const parent = categoryMap.get(category.parentId);
            parent.children.push(categoryMap.get(category.id));
        }
        else {
            rootCategories.push(categoryMap.get(category.id));
        }
    });
    return rootCategories;
}
function getAllCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `select * from category;`;
        const res = yield (0, dal_1.runQuery)(q);
        const categories = res.map(c => new CategoryModel_1.CategoryModel(c.id, c.name, c.parent_id));
        // build categories tree
        return buildHierarchy(categories);
    });
}
function getAllCategoriesById(parentCategoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        const categoryIds = [parentCategoryId];
        const q = `select id from category where parent_id = ${parentCategoryId}`;
        const children = yield (0, dal_1.runQuery)(q);
        for (const child of children) {
            categoryIds.push(...(yield getAllCategoriesById(child.id)));
        }
        return categoryIds;
    });
}
// getAllCategories().then((r) => console.log(JSON.stringify (r)));
