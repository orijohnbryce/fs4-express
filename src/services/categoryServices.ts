import { runQuery } from "../dal/dal"
import { CategoryModel } from "../models/CategoryModel"


interface CategoryHierarchy {
    id: number;
    name: string;
    parentId?: number;
    children?: CategoryHierarchy[];
}


function buildHierarchy(categories: CategoryModel[]) {
    const categoryMap = new Map<number, CategoryHierarchy>();
    const rootCategories: CategoryHierarchy[] = [];

    categories.forEach(cat => {
        const hierarchyItem: CategoryHierarchy = {
            id: cat.id!,
            name: cat.name,
            parentId: cat.parentId,
            children: []
        }

        categoryMap.set(cat.id!, hierarchyItem);
    })

    categories.forEach(category =>{
        if (category.parentId){
            const parent = categoryMap.get(category.parentId);
            parent.children.push(categoryMap.get(category.id));
        }else {
            rootCategories.push(categoryMap.get(category.id))
        }
    })
    return rootCategories
}


export async function getAllCategories() {

    const q = `select * from category;`;
    const res = await runQuery(q) as any[];

    const categories = res.map(c => new CategoryModel(c.id, c.name, c.parent_id))


    // build categories tree
    return buildHierarchy(categories)    
}

getAllCategories().then((r) => console.log(r));
