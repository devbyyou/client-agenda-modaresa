import AppointmentsReducer from './appointments';
import BuyersReducer from './buyers';
import VendorsReducer from './vendors';
import UsersReducer from './users';

const reducer = {
  appointments: AppointmentsReducer,
  buyers: BuyersReducer,
  vendors: VendorsReducer,
  users: UsersReducer,
};

export default reducer;
