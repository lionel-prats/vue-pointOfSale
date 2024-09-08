// de la depenencia @formkit/themes (instalada en v319) extraemos la funcion generateClasses que nos va a permitir generar las clases css que se van a ir aplicando a los diferentes campos que tiene Formkit (v320) 
import { generateClasses } from "@formkit/themes"

const config = {
    config: {
        classes: generateClasses({

            // los atributos que definamos en este objeto aplicaran para todos los elementos de Formkit (v321)
            global: {
                input: "w-full p-3 border border-gray-300 rounded text-gray-700 placeholder-gray-400",
                label: "block mb-1 font-bold text-lg",
                message: "text-red-500 mb-5",
                
                // wrapper es la clase del <div> que contiene a un <label> y su correspondiente <input> en el diseño de Formkit (inspeccionar en devtools), asi que le damos una separacion entre si (v321)
                wrapper: "space-y-2 mb-3", 
            },
            
            // en este objeto aplicamos clases de tailwind a inputs file de nuestros forms de Formkit
            file: {
                // estilos para la leyenda "No file chosen" que se muestra debajo de u input file cuando el usuario no ha cargado ningun archivo (v322)
                noFiles: "block my-2",
                
                // oculto el nombre del archivo cargado por el usuario en el input que se muestra debajo del onput (v322)
                fileItem: "hidden",
            },
            
            // en este objeto aplicamos clases de tailwind a inputs number de nuestros forms de Formkit
            number: {
                // message: "text-red-500",
            },
            
            // en este objeto aplicamos clases de tailwind a selects de nuestros forms de Formkit
            select: {
                // message: "text-red-500",
            },
            
            // en este objeto aplicamos clases de tailwind a inputs o buttons submit de nuestros forms de Formkit (v323)
            submit: {
                // con $reset elimino para los inputs o buttons submit los estilos globales definidos mas arriba para todos los inputs, y luego aplico los estilos que le quiero dar a todos los inputs submit de los form de Formkit (v323)
                input: "$reset bg-green-400 hover:bg-green-500 w-full p-2 font-bold uppercase disabled:opacity-50"
            },

            // en este objeto aplicamos clases de tailwind a inputs text de nuestros forms de Formkit
            text: {
                // con $reset elimino para los mensajes de error de los inputs text todos los estilos globales que pueda haber definido en la key "global" mas arriba y darle estilos solamente para los error messages de estos inputs text (v321)
                // message: "$reset text-green-500",
            },

        })
    }
}

export default config