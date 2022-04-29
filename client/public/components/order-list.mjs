import { RegisterComponent, Component, SideLoad } from './components.mjs';
import * as Auth from '../auth.mjs';

class OrderList extends Component {
    static __IDENTIFY() { return 'order-list'; }

    constructor() {
        super(OrderList);
    }

    async OnMount() {
        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${await Auth.GetToken()}` },
        };

        const res = await fetch('/api/auth/orders', options).then(res => res.json());

        console.log(res);

        this.setState({
            ...this.getState,
            orders: res.data,
        }, false);
        console.log(this.state);
    }

    Render() {
        return {
            template: /* html */`
                <div class="order-header">
                    <span class="order-header-title">Your Orders</span>
                </div>

                <div class="orders-list-body">
                    ${this.state.orders.map(order => /* html */`
                        <div class="orders-list-item">
                            <a href="/orders/order?id=${order.id}"><div class="order-list-item">
                                <div class="order-list-item-header">
                                    <span class="order-list-item-header-title">Order #${order.id}</span>
                                    <span class="order-list-item-header-subtitle">Placed on ${new Date(order.date_placed).toDateString()}</span>
                                </div>
                                <div class="order-list-item-body">
                                    <span class="order-list-item-body-item-title">Paid: £${parseFloat(order.subtotal_paid).toFixed(2)}</span>
                                    <span class="order-list-item-body-item-title">Shipped? ${order.shipped ? 'Yes' : 'No'}</span>
                                </div>
                            </div></a>
                        </div>
                    `).join('')}
                </div>
            `,
            style: SideLoad('/components/css/order.css'),
        };
    }

    OnRender() {
    }
}

RegisterComponent(OrderList);
