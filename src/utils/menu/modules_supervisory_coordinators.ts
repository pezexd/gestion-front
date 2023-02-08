import { module } from "@/stores/top-menu"

const modules_supervisory_supports: module[] = [
    {
        name: "Coordinador de supervisión",
        icon: "UsersIcon",
        items: [
            {
                name: "Bitacora de Territorio",
                route: "binnacle_territories.index",
                icon: "MinusIcon",
            },
            {
                name: "Informe de supervisión",
                route: "supervisoryReports.index",
                icon: "MinusIcon",
            }
        ]
    },
    {
        name: "Revision Apoyo a la supervisión",
        icon: "UsersIcon",
        items: [
            {
                name: "Fortalecimiento a la supervisión monitores e instructores",
                route: "strengtheningSuperMonIns.index",
                icon: "MinusIcon",
            },
            {
                name: "Fortalecimiento a la supervisión gestores",
                route: "strengtheningSupervisionMans.index",
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

export default modules_supervisory_supports