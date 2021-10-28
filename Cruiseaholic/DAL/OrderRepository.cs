using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cruiseaholic.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System.Linq;
using System;
using System.Diagnostics.CodeAnalysis;
using NLog;
using Newtonsoft.Json;

namespace Cruiseaholic.DAL
{
    [ExcludeFromCodeCoverage]
    public class OrderRepository : IOrderRepository
    {

        private readonly OrderContext _orderDB;

        private static readonly Logger _logger = LogManager.GetLogger("cruiseaholic-logs");
        private static readonly Logger _dbLogger = LogManager.GetLogger("cruiseaholic-db-changes");

        public OrderRepository(OrderContext orderDB)
        {
            _orderDB = orderDB;
        }

        [HttpPost]
        public async Task<string> NewOrder([FromBody] CustomerOrder newOrder)
        {
            Customer existingCustomer;

            var route = await _orderDB.Route.SingleAsync(route => route.ToDestination.Equals(newOrder.ToDestination) && route.FromDestination.Equals(newOrder.FromDestination));

            try
            {
                existingCustomer = await _orderDB.Customer.SingleAsync(customer => customer.Email.Equals(newOrder.Email));
            }
            catch
            {
                existingCustomer = null;
            }

            if (existingCustomer != null)
            {
                existingCustomer.FirstName = newOrder.FirstName;
                existingCustomer.LastName = newOrder.LastName;
                existingCustomer.PhoneNumber = newOrder.PhoneNumber;

                var order = new Order()
                {
                    NumberOfAdults = newOrder.NumberOfAdults,
                    NumberOfChildren = newOrder.NumberOfChildren,
                    NumberOfVehicles = newOrder.NumberOfVehicles,

                    IsRoundtrip = newOrder.IsRoundtrip,
                    DepartureDate = newOrder.DepartureDate,
                    ReturnDate = newOrder.ReturnDate,

                    CardNumber = newOrder.CardNumber,
                    CardholderName = newOrder.CardholderName,
                    CVC = newOrder.CVC,
                    Expiry = newOrder.Expiry,

                    Customer = existingCustomer,
                    Route = route,
                };

                existingCustomer.Orders.Add(order);
                await _orderDB.SaveChangesAsync();
                _dbLogger.Info("Added new order to the DB for existing customer. Order saved: "
                    + JsonConvert.SerializeObject(order, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
                    }));
                return existingCustomer.Email;
            }
            else
            {
                var customer = new Customer()
                {
                    FirstName = newOrder.FirstName,
                    LastName = newOrder.LastName,
                    Email = newOrder.Email,
                    PhoneNumber = newOrder.PhoneNumber,
                };

                var order = new Order()
                {
                    NumberOfAdults = newOrder.NumberOfAdults,
                    NumberOfChildren = newOrder.NumberOfChildren,
                    NumberOfVehicles = newOrder.NumberOfVehicles,

                    IsRoundtrip = newOrder.IsRoundtrip,
                    DepartureDate = newOrder.DepartureDate,
                    ReturnDate = newOrder.ReturnDate,

                    CardNumber = newOrder.CardNumber,
                    CardholderName = newOrder.CardholderName,
                    CVC = newOrder.CVC,
                    Expiry = newOrder.Expiry,

                    Customer = customer,
                    Route = route,
                };

                _orderDB.Add(order);
                await _orderDB.SaveChangesAsync();
                _dbLogger.Info("Added new order to the DB for a new customer. Order saved: " + JsonConvert.SerializeObject(order, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
                    }));
                return order.Customer.Email;
            }
        }

        public async Task<Customer> GetCustomerInfo(string email)
        {
            try
            {
                var customerInfo = await _orderDB.Customer.SingleAsync(customer => customer.Email == email);
                return customerInfo;
            }
            catch (Exception e)
            {
                _logger.Error(e.Message);
                return null;
            }
        }

        public async Task<List<Route>> GetRoutes()
        {
            try
            {
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch (Exception e)
            {
                _logger.Error(e.Message);
                return null;
            }
        }

        public async Task<List<Route>> AddRoute([FromBody] Route route)
        {
            try
            {
                _orderDB.Route.Add(route);
                await _orderDB.SaveChangesAsync();
                _dbLogger.Info("Added a new route: " + JsonConvert.SerializeObject(route, Formatting.Indented));
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch (Exception e)
            {
                _logger.Info(e.Message);
                return null;
            }
        }

        public async Task<List<Route>> ChangeRoute([FromBody] Route route)
        {
            try
            {
                Route routeToChange = await _orderDB.Route.FindAsync(route.Id);
                routeToChange.FromDestination = route.FromDestination;
                routeToChange.ToDestination = route.ToDestination;
                routeToChange.PriceChildren = route.PriceChildren;
                routeToChange.PriceAdults = route.PriceAdults;
                routeToChange.PriceVehicle = route.PriceVehicle;

                await _orderDB.SaveChangesAsync();
                _dbLogger.Info("Changed route: " + JsonConvert.SerializeObject(route, Formatting.Indented));
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch (Exception e)
            {
                _logger.Error(e.Message);
                return null;
            }
        }

        public async Task<List<Route>> RemoveRoute(int id)
        {
            try
            {
                Route routeToRemove = await _orderDB.Route.FindAsync(id);
                _orderDB.Route.Remove(routeToRemove);
                await _orderDB.SaveChangesAsync();
                _dbLogger.Info("Removed route with id: " + id);
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch (Exception e)
            {
                _logger.Error(e.Message);
                return null;
            }
        }

        public static byte[] CreateHash(string password, byte[] salt)
        {
            return KeyDerivation.Pbkdf2(
                                password: password,
                                salt: salt,
                                prf: KeyDerivationPrf.HMACSHA512,
                                iterationCount: 1000,
                                numBytesRequested: 32);
        }

        public static byte[] CreateSalt()
        {
            var csp = new RNGCryptoServiceProvider();
            var salt = new byte[24];
            csp.GetBytes(salt);
            return salt;
        }

        public async Task<bool> Login(User user)
        {
            try
            {
                DBUser userFromDB = await _orderDB.User.FirstOrDefaultAsync(u => u.Username == user.Username);
                byte[] hash = CreateHash(user.Password, userFromDB.Salt);
                bool ok = hash.SequenceEqual(userFromDB.Password);
                return ok;
            }
            catch (Exception err)
            {
                _logger.Error(err.Message);
                return false;
            }
        }
    }
}

