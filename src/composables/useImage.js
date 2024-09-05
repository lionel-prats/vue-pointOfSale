import { ref, computed } from "vue"

// useFirebaseStorage() -> funcion de vuefire para autenticar nuestra app vue con nuestro backend Firebase
import { useFirebaseStorage } from "vuefire" // v327

// ref() -> funcion para obtener una referencia a lal ubicacion en el storage donde almacenaremos una nueva imagen (v327)
// uploadBytesResumable() -> funcion para subir archivos al storage de Firebase (v327)
// getDownloadURL() -> funcion para obtener la URL de un archivo una vez subido al storage de Firebase (v327)
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage" // v327

import { uid } from "uid"

export default function useImage() {
    
    const url = ref("")

    // con esta linea conecto mi app vue con el Storage de Firebase (la conexion se logra gracias a las credenciales que me dio Firebase cuando cree el backend y que tengo almacenadas en .env.local; de alguna manera en esta linea estoy utilizando esas credenciales y conectando esta app vue con el storage de Firebase) (v327)
    const storage = useFirebaseStorage()

    const onFileChange = e => {

        const file = e.target.files[0] // obtengo la interfaz (término interno de JavaScript, es una especie de objeto que representa la imagen cargada por el usuarios en el form de un nuevo producto) (v327)    
        const filename = `${uid()}.jpg` // nombre unico que tendrá la imagen en el store de Firebase (v327)
    
        // esta variable va a contener una referencia a la ubicacion en el storage de Firebase donde vamos a almacenar la imagen que el usuario cargue en el form de crear producto (v327)
        // toma 2 parametros: la conexion a Firebase y el path dentro del servicio de Storage de Firebase (creamos la carpeta /products y dentro la imagen con el nombre unico)
        const sRef = storageRef(storage, `/products/${filename}`) 

        // en esta linea subo la imagen cargada por el usuarios en el form de un uevo producto al storage de Firebase 
        const uploadTask = uploadBytesResumable(sRef, file)
        
        // uploadTask.on("state_changed") -> evento que se ejecuta cuando la imagen se empieza a subir
        // durante la ejecucion de este evento se pueden desencadenar la ejecucion de 3 callbacks (abajo esta la explicacion)
        uploadTask.on("state_changed",

            // este callback se ejecuta cuando la imagen se empieza a subir y cuando se termina de subir pudiendo acceder a cierta informacion (v327)
            (informacionCallback1) => console.log(informacionCallback1),

            // este callback se ejecuta si ocurrio algun error durante la subida de la imagen y el upload falló (v327)
            (error) => console.log(error),

            // este callback se ejecuta si la imagen se subio correctamente (v327)
            (informacionCallback3) =>  {

                console.log(informacionCallback3);

                // getDownloadURL es una Promise entonces uso .then; pasandole uploadTask.snapshot.ref me retornará la URL de la imagen que acbo de subir al storage para poder accederla desde el (v327)
                getDownloadURL(uploadTask.snapshot.ref)
                    .then( ( downloadURL ) => {
                        url.value = downloadURL // almaceno la url de la imagen subida en el state (v328)
                    })
            },
        )
    }

    const isImgeUploaded = computed( () => {
        return url.value ? url.value : null
    })

    return {
        // states
        url, 

        // getters
        isImgeUploaded,    

        // acciones
        onFileChange,
    }
}