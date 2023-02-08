import { module } from "@/stores/top-menu"

const modules_ambassador_or_leaders: module[] = [
    {
        name: "Revisiones Embajadores",
        icon: "UsersIcon",
        items: [
            {
                name: "Bitacora Show cultural",
                route: "culturalShows.index",
                icon: "MinusIcon",
            },
        ]
    },
    {
        "name": "Caracterización",
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

export default modules_ambassador_or_leaders