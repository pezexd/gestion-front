import { module } from "@/stores/top-menu"

const modules_culture_secretaries: module[] = [
    {
        name: "Secretaria de Cultura",
        icon: "UsersIcon",
        items: [
            {
                name: "Informes",
                route: "reports.index",
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

export default modules_culture_secretaries