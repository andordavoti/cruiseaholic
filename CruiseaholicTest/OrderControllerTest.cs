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
        public async Task AddRouteNotLoggedIn()
        {
            // Arrange
            repoMock.Setup(o => o.AddRoute(It.IsAny<Route>())).ReturnsAsync(It.IsAny<List<Route>>());
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isNotLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await orderController.AddRoute(It.IsAny<Route>()) as UnauthorizedObjectResult;

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
        public void AuthorizeUserLoggedIn()
        {
            // TODO: får ikke lagt inn en repoMock (ex. repoMock.Setup(o => o.RemoveRoute(2)).ReturnsAsync(routes);) fordi den ikke bruker repository
            // Arrange
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = orderController.AuthorizeUser() as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
        }

        [Fact]
        public void AuthorizeUserNotLoggedIn()
        {
            // TODO: får ikke lagt inn en repoMock (ex. repoMock.Setup(o => o.RemoveRoute(2)).ReturnsAsync(routes);) fordi den ikke bruker repository
            // Arrange
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            mockSession[_isLoggedIn] = _isLoggedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            orderController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = orderController.AuthorizeUser() as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
        }

        [Fact]
        public async Task Login()
        {
            // Arrange
            var user = new User
            {
                Username = "Admin",
                Password = "Admin123"
            };

            repoMock.Setup(o => o.Login(user)).ReturnsAsync(true);
            var orderController = new OrderController(repoMock.Object, logMock.Object);

            // Act
            var result = await orderController.Login(user) as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(true, result.Value);
        }

        // TODO: add tests for cases where the model isn't valid
        // TODO: add cases for when the user isn't logged in
        // TODO: does the LogOut endpoint need testing?
    }
}
