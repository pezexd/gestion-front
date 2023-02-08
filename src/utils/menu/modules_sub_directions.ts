import { module } from "@/stores/top-menu"

const modules_sub_directions: module[] = [
    {
        name: "Sub Dirección",
        icon: "UsersIcon",
        items: [
            {
                name: "Bitacora de Territorio",
                route: "binnacle_territories.index",
                icon: "MinusIcon",
            }
        ]
    },
    {
        name: "Caracterización",
        icon: "LayersIcon",
        items: [
            {
                name: "Encuesta",
                route: "polls.index",
                icon: "MinusIcon",
            }
        ]
    }
]

export default modules_sub_directions