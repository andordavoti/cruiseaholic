using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Cruiseaholic.Controllers;
using Cruiseaholic.DAL;
using Cruiseaholic.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CruiseaholicTest
{

    public class UnitTest1
    {
        private const string _isLoggedIn = "_isLoggedIn";
        private const string _isNotLoggedIn = "";

        private readonly Mock<IOrderRepository> repoMock = new();
        private readonly Mock<ILogger<OrderController>> logMock = new();

        private readonly Mock<HttpContext> mockHttpContext = new();
        private readonly MockHttpSession mockSession = new();

        [Fact]
        public async Task NewOrder()
        {
            // Arrange
            var customerOrder = new CustomerOrder()
            {
                NumberOfAdults = 1,
                NumberOfChildren = 1,
                NumberOfVehicles = 0,
                IsRoundtrip = true,
                DepartureDate = "01/01/2022",
                ReturnDate = "02/02/2022",
                CardNumber = 1111111111111111,
                CardholderName = "Ola Nordman",
                CVC = 123,
                Expiry = "01/22",
                Email = "test@gmail.com",
                FirstName = "Ola",
                LastName = "Nordman",
                PhoneNumber = "12345678",
                FromDestination = "Oslo, Norway",
                ToDestination = "Kiel, Germany",
            };

            repoMock.Setup(o => o.NewOrder(customerOrder)).ReturnsAsync(customerOrder.Email);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            // Act
            var result = await orderController.NewOrder(customerOrder) as OkObjectResult;

            // Assert
            Assert.Equal("test@gmail.com", result.Value);
        }

        [Fact]
        public async Task NewOrderValidationError()
        {
            // Arrange

            repoMock.Setup(o => o.NewOrder(It.IsAny<CustomerOrder>())).ReturnsAsync(It.IsAny<string>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            orderController.ModelState.AddModelError("FirstName", "Model not valid in NewOrder!");

            // Act
            var result = await orderController.NewOrder(It.IsAny<CustomerOrder>()) as BadRequestObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Model not valid in NewOrder!", result.Value);
        }

        [Fact]
        public async Task NewOrderDBError()
        {
            // Arrange
            repoMock.Setup(o => o.NewOrder(It.IsAny<CustomerOrder>())).ThrowsAsync(null);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            // Act
            var result = await orderController.NewOrder(It.IsAny<CustomerOrder>()) as BadRequestObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Something went wrong saving the order!", result.Value);
        }

        [Fact]
        public async Task GetCustomerInfo()
        {
            var customerInfo = new Customer
            {
                Email = "test@gmail.com",
            };

            // Arrange
            repoMock.Setup(o => o.GetCustomerInfo("test@gmail.com")).ReturnsAsync(customerInfo);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            // Act
            var result = await orderController.GetCustomerInfo("test@gmail.com") as OkObjectResult;

            // Assert
            Assert.Equal(customerInfo, result.Value);
        }

        [Fact]
        public async Task GetCustomerInfoEmailNotFount()
        {
            var email = "test@gmail.com";

            // Arrange
            repoMock.Setup(o => o.GetCustomerInfo("test@gmail.com")).ReturnsAsync(It.IsAny<Customer>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            // Act
            var result = await orderController.GetCustomerInfo("test@gmail.com") as NotFoundObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Customer with email: " + email + ", was not found", result.Value);
        }

        [Fact]
        public async Task GetRoutes()
        {
            // Arrange
            var route = new Route
            {
                FromDestination = "Oslo, Norway",
                ToDestination = "Strømstad, Sweden",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };
            var routes = new List<Route>
            {
                route
            };

            repoMock.Setup(o => o.GetRoutes()).ReturnsAsync(routes);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            // Act
            var result = await orderController.GetRoutes() as OkObjectResult;

            // Assert
            Assert.Equal(routes, result.Value);
        }

        [Fact]
        public async Task GetRoutesDBError()
        {
            // Arrange
            var route = new Route
            {
                FromDestination = "Oslo, Norway",
                ToDestination = "Strømstad, Sweden",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };
            var routes = new List<Route>
            {
                route
            };

            repoMock.Setup(o => o.GetRoutes()).ReturnsAsync((List<Route>)null);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            // Act
            var result = await orderController.GetRoutes() as NotFoundObjectResult;

            // Assert
            Assert.Equal("Routes not set up correcly in DB", result.Value);
        }

        [Fact]
        public async Task AddRouteLoggedIn()
        {
            // Arrange
            var route = new Route
            {
                FromDestination = "Oslo, Norway",
                ToDestination = "Hirtshals, Denmark",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };
            var routes = new List<Route>
            {
                route
            };

            repoMock.Setup(o => o.AddRoute(route)).ReturnsAsync(routes);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.AddRoute(route) as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(routes, result.Value);
        }

        [Fact]
        public async Task AddRouteDBError()
        {
            // Arrange
            repoMock.Setup(o => o.AddRoute(It.IsAny<Route>())).ReturnsAsync((List<Route>)null);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.AddRoute(It.IsAny<Route>()) as ObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
            Assert.Equal("Unable to add new route", result.Value);
        }

        [Fact]
        public async Task AddRouteValidationError()
        {
            // Arrange
            repoMock.Setup(o => o.AddRoute(It.IsAny<Route>())).ReturnsAsync(It.IsAny<List<Route>>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            orderController.ModelState.AddModelError("ToDestination", "Model not valid in AddRoute!");

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.AddRoute(It.IsAny<Route>()) as BadRequestObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Model not valid in AddRoute!", result.Value);
        }

        [Fact]
        public async Task AddRouteNotLoggedIn()
        {
            // Arrange
            repoMock.Setup(o => o.AddRoute(It.IsAny<Route>())).ReturnsAsync(It.IsAny<List<Route>>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.AddRoute(It.IsAny<Route>()) as UnauthorizedResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
        }

        [Fact]
        public async Task ChangeRouteLoggedIn()
        {
            // Arrange
            var route = new Route
            {
                Id = 1,
                FromDestination = "Oslo, Norway",
                ToDestination = "Hirtshals, Denmark",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };
            var routes = new List<Route>
            {
                route
            };

            repoMock.Setup(o => o.ChangeRoute(route)).ReturnsAsync(routes);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.ChangeRoute(route) as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(routes, result.Value);
        }

        [Fact]
        public async Task ChangeRouteNotLoggedIn()
        {
            // Arrange
            repoMock.Setup(o => o.ChangeRoute(It.IsAny<Route>())).ReturnsAsync(It.IsAny<List<Route>>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.ChangeRoute(It.IsAny<Route>()) as UnauthorizedResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
        }

        [Fact]
        public async Task ChangeRouteDBError()
        {
            // Arrange
            repoMock.Setup(o => o.ChangeRoute(It.IsAny<Route>())).ReturnsAsync((List<Route>)null);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.ChangeRoute(It.IsAny<Route>()) as ObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
            Assert.Equal("Unable to change route", result.Value);
        }

        [Fact]
        public async Task ChangeRouteValidationError()
        {
            // Arrange
            repoMock.Setup(o => o.ChangeRoute(It.IsAny<Route>())).ReturnsAsync(It.IsAny<List<Route>>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            orderController.ModelState.AddModelError("ToDestination", "Model not valid in ChangeRoute!");

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.ChangeRoute(It.IsAny<Route>()) as BadRequestObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Model not valid in ChangeRoute!", result.Value);
        }

        [Fact]
        public async Task RemoveRouteLoggedIn()
        {
            // Arrange
            var route = new Route
            {
                Id = 1,
                FromDestination = "Oslo, Norway",
                ToDestination = "Hirtshals, Denmark",
                PriceChildren = 400,
                PriceAdults = 800,
                PriceVehicle = 500
            };

            var routes = new List<Route>
            {
                route
            };

            repoMock.Setup(o => o.RemoveRoute(2)).ReturnsAsync(routes);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.RemoveRoute(2) as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(routes, result.Value);
        }

        [Fact]
        public async Task RemoveRouteNotLoggedIn()
        {
            // Arrange
            repoMock.Setup(o => o.RemoveRoute(It.IsAny<int>())).ReturnsAsync(It.IsAny<List<Route>>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.RemoveRoute(It.IsAny<int>()) as UnauthorizedResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
        }

        [Fact]
        public async Task RemoveRouteDBError()
        {
            // Arrange
            repoMock.Setup(o => o.RemoveRoute(0)).ReturnsAsync((List<Route>)null);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.RemoveRoute(0) as ObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
            Assert.Equal("Unable to remove route", result.Value);
        }

        [Fact]
        public void AuthorizeUserLoggedIn()
        {
            // Arrange
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = orderController.AuthorizeUser() as OkResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
        }

        [Fact]
        public void AuthorizeUserNotLoggedIn()
        {
            // Arrange
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = orderController.AuthorizeUser() as UnauthorizedResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
        }

        [Fact]
        public async Task LoginSuccess()
        {
            // Arrange
            repoMock.Setup(o => o.Login(It.IsAny<User>())).ReturnsAsync(true);

            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.Login(It.IsAny<User>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.True((bool)result.Value);
        }

        [Fact]
        public async Task LoginValidationError()
        {
            // Arrange
            repoMock.Setup(o => o.Login(It.IsAny<User>())).ReturnsAsync(true);

            var orderController = new OrderController(repoMock.Object, logMock.Object);

            orderController.ModelState.AddModelError("Username", "Model not valid in LoggInn!");

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.Login(It.IsAny<User>()) as BadRequestObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Model not valid in LoggInn!", result.Value);
        }

        [Fact]
        public async Task LoginWrongUsernameOrPassword()
        {
            // Arrange
            repoMock.Setup(o => o.Login(It.IsAny<User>())).ReturnsAsync(false);

            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.Login(It.IsAny<User>()) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.False((bool)result.Value);
        }

        [Fact]
        public void LogOut()
        {
            // Arrange
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = orderController.LogOut() as OkResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
        }
    }
}
