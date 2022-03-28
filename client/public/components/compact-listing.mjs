import { RegisterComponent, Component } from './components.mjs';

class CompactProductListing extends Component {
    static __IDENTIFY() { return 'compact-listing'; }

    constructor() {
        super(CompactProductListing);
    }

    Render() {
        return {
            template: `
                <div class="product-listing">
                    <a href="{this.state.listing}">
                    <div class="product-listing-image">
                        <img class="product-image" 
                            title="Image of {this.state.name}" 
                            alt="Image of {this.state.name}"     
                            src="{this.state.image}">
                    </div>
                    <div class="product-listing-info">
                        <div class="product-listing-name">{this.state.name}</div>
                        </a>
                        ${this.state.discount
                            ? '<span class="product-listing-price-full">£{this.state.price}</span><span class="product-listing-price-new">£{this.state.discount}</span>'
                            : '<span class="product-listing-price">£{this.state.price}</span>'}
                    </div>
                </div>
            `,
            style: `
                a {
                    text-decoration: none;
                    color: inherit;
                }

                a:hover {
                    text-decoration: underline;
                }

                .product-listing {
                    display: flex;
                    flex-direction: column;
                    margin: 7px;
                    max-width: 320px;
                }
                .product-listing-image {
                    display: block;
                    margin: 0 auto;
                    max-width: 100%;
                }
                .product-listing-info {
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                    max-width: 100%;
                }
                .product-listing-name {
                    font-size: 1.2em;
                    font-weight: bold;
                }

                .product-listing-price {
                    font-size: 1.1em;
                }

                .product-listing-price-full {
                    text-decoration: line-through;
                    font-size: 0.9em;
                }
                .product-listing-price-new {
                    font-weight: bold;
                    color: red;
                    font-size: 1.1em;
                }

                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    .product-listing {
                        margin: 3px;
                        width: 400px;
                    }
                    .product-listing-image {
                        display: block;
                    }
                    .product-image {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
            `,
        };
    }

    OnceRendered() {

    }
}

RegisterComponent(CompactProductListing);
