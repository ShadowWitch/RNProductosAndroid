import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigation/Navigator';
import { AuthProvider } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';

//* CLOUDINARY_URL=cloudinary://924484792946237:WrEDiCtnFG4bwLfnaAZc5lES3hE@dgt01p0qg

// cafe_user
// iHmwtkZ3zR9x2I8t

const AppState = ({ children }: any) => {

  return (
    <AuthProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </AuthProvider>
  )
}

const App = () => {

  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
}

export default App;