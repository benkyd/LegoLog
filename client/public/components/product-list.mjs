import { RegisterComponent, Component } from './components.mjs';

class ProductList extends Component {
    static __IDENTIFY() { return 'product-list'; }

    constructor() {
        super(ProductList);
    }

    async Render() {
        const route = this.state.getroute;
        const products = await fetch(route).then(response => response.json());

        return {
            template: `
                <h2>{this.state.title}</h2>
                <div class="product-list">
                    ${products.data.map(product => {
                        return `<compact-listing-component name="${product.name}"
                                    id="${product.id}"
                                    listing="${product.listing}"
                                    image="${product.image}"
                                    price="${product.price}"
                                    discount="${product.discount || ''}"></compact-listing-component>
                        `;
                    }).join('')}
                </div>
                <!--Infinite Loading-->
                <div class="product-list-loader">
                    <!-- https://loading.io/css/ -->
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            `,
            style: `
                h2 {
                    margin-block-start: 0;
                }
                .product-list {
                    display: flex;
                    justify-content: space-evenly;
                    flex-wrap: wrap;
                    margin: 0 auto;
                }

                .product-list-buttons {
                    display: flex;
                    justify-content: space-evenly;
                    margin: 0 auto;
                }

                .product-list-button {
                    max-width: 100px;
                    padding: 5px;
                    font-size: 1em;
                    font-weight: bold;
                    background-color: #85DEFF;
                    color: #fff;
                    border: none;
                }

                .product-list-loader {
                    display: flex;
                    justify-content: center;
                }

                .lds-ellipsis {
                    display: inline-block;
                    position: relative;
                    width: 80px;
                    height: 80px;
                }
                .lds-ellipsis div {
                    position: absolute;
                    top: 33px;
                    width: 13px;
                    height: 13px;
                    border-radius: 50%;
                    background: #7F5CFF;
                    animation-timing-function: cubic-bezier(0, 1, 1, 0);
                }
                .lds-ellipsis div:nth-child(1) {
                    left: 8px;
                    animation: lds-ellipsis1 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(2) {
                    left: 8px;
                    animation: lds-ellipsis2 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(3) {
                    left: 32px;
                    animation: lds-ellipsis2 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(4) {
                    left: 56px;
                    animation: lds-ellipsis3 0.6s infinite;
                }
                @keyframes lds-ellipsis1 {
                    0% {
                        transform: scale(0);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                @keyframes lds-ellipsis3 {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(0);
                    }
                }
                @keyframes lds-ellipsis2 {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(24px, 0);
                    }
                }
                            
                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    .product-list {
                        /*justify-content: space-between;*/
                    }
                }
            `,
            state: {
                ...this.getState,
                products,
            },
        };
    }


    OnceRendered() {


    }
}

RegisterComponent(ProductList);
