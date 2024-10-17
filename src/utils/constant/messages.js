
const generateMessages = (entity) => ({
    alreadyExist: `${entity} already exist`,
        notFound: `${entity} not found`,
        createdSuccessfully: `${entity} created successfully`,
        updatedSuccessfully: `${entity} updated successfully`,
        deletedSuccessfuly: `${entity} created successfully`,
        failToCreate: `fail to create ${entity}`,
        failToUpdate: `fail to update ${entity}`,
        failToDelete: `fail to delete ${entity}`
})
export const messages = {
    category:generateMessages('category'),
    subcategory:generateMessages('subcategory'),
    brand: generateMessages('brand'),
    product: generateMessages('product'),
    user: {...generateMessages('user'),verified:"user verified successfully", invalidCreadentials:"invalid creadintals",notAuthorized:"not authorized to access this api"},
    review: generateMessages('review'),
    coupon: generateMessages('coupon'),
    order: generateMessages('order')
    
}