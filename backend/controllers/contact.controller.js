import User from "../models/user.model.js";


export const searchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body;
        if(searchTerm===undefined || searchTerm===null || searchTerm==='' ){
            const error = new Error('Search term is required');
            error.status = 400;
            throw error;
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g, 
            '\\$&'
        );

        const regex = new RegExp(sanitizedSearchTerm, 'i');
        const contacts = await User.find({
            $and: [
                {_id: { $ne: req.userId } },
                {$or: [
                    { name: regex },
                    { email: regex },
                ]}
            ]
        });

        const sanitizedContacts = contacts.map(contact =>{
                return {
                    _id: contact._id,
                    name: contact.name,
                    email: contact.email,
                    color: contact.color,
                    image: contact.image,
                }
        });

        return res.status(200).json({
            contacts: sanitizedContacts
        });

    } catch (error) {
        next(error);
    }
}