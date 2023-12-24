//contacts.repository.js
// Importar la clase ContactDTO
import ContactDTO from './path/to/ContactDTO';

// Definir la clase ContactRepository
class ContactRepository {
    // Constructor de la clase que recibe un objeto dao
    constructor(dao) {
        this.dao = dao;
    }

    // Obtener todos los contactos
    getContacts = async () => {
        try {
            let result = await this.dao.get();
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los contactos");
        }
    }

    // Crear un nuevo contacto
    createContact = async (contact) => {
        try {
            // Crear una instancia de ContactDTO a partir de los datos del contacto
            let contactToInsert = new ContactDTO(contact);
            // Insertar el contacto en la base de datos
            let result = await this.dao.create(contactToInsert);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al crear el contacto");
        }
    }
}

// Exportar la clase ContactRepository
export default ContactRepository;
