import { module } from "@/stores/top-menu"

const modules_methodology_leaders: module[] = [
    {
        name: "Lider Metodológico",
        icon: "UsersIcon",
        items: [
            {
                name: "Seguimiento metodológico",
                route: "methodologicalStrengthenings.index",
                icon: "MinusIcon",
            },
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

export default modules_methodology_leaders