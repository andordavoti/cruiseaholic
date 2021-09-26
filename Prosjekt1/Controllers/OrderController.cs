using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cruisaholic.DAL;
using Cruisaholic.Models;
using Microsoft.Extensions.Logging;

namespace Cruisaholic.Controllers
{
    [Route("[controller]/[action]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderDB;

        private ILogger<OrderController> _orderLog;

        public OrderController(IOrderRepository orderDB, ILogger<OrderController> orderLog)
        {
            _orderDB = orderDB;
            _orderLog = orderLog;
        }

        [HttpPost]
        public async Task<ActionResult> NewOrder([FromBody] Order newOrder)
        {
            if (ModelState.IsValid)
            {
                var orderId = await _orderDB.NewOrder(newOrder);

                if (orderId == -1)
                {
                    _orderLog.LogInformation("Something went wrong saving the order!");
                    return BadRequest("Something went wrong saving the order!");
                }
                return Ok(orderId);
            }
            _orderLog.LogInformation("Model validation of Order:");

            _orderLog.LogInformation("Property FirstName: " + ModelState.GetValidationState("FirstName"));
            _orderLog.LogInformation("Property LastName: " + ModelState.GetValidationState("LastName"));
            _orderLog.LogInformation("Property Email: " + ModelState.GetValidationState("Email"));
            _orderLog.LogInformation("Property PhoneNumber: " + ModelState.GetValidationState("PhoneNumber"));
            _orderLog.LogInformation("Property NumberOfChildren: " + ModelState.GetValidationState("NumberOfChildren"));
            _orderLog.LogInformation("Property NumberOfAdults: " + ModelState.GetValidationState("NumberOfAdults"));
            _orderLog.LogInformation("Property NumberOfVehicles: " + ModelState.GetValidationState("NumberOfVehicles"));
            _orderLog.LogInformation("Property IsRoundtrip: " + ModelState.GetValidationState("IsRoundtrip"));
            _orderLog.LogInformation("Property FromDestination: " + ModelState.GetValidationState("FromDestination"));
            _orderLog.LogInformation("Property ToDestination: " + ModelState.GetValidationState("ToDestination"));
            _orderLog.LogInformation("Property DepartureDate: " + ModelState.GetValidationState("DepartureDate"));
            _orderLog.LogInformation("Property ArrivalDate: " + ModelState.GetValidationState("ArrivalDate"));


            _orderLog.LogInformation("Property CardNumber: " + ModelState.GetValidationState("CardNumber"));
            _orderLog.LogInformation("Property CardholderName: " + ModelState.GetValidationState("CardholderName"));
            _orderLog.LogInformation("Property CVC: " + ModelState.GetValidationState("CVC"));
            _orderLog.LogInformation("Property Expiry: " + ModelState.GetValidationState("Expiry"));

            _orderLog.LogInformation("Total error count: " + ModelState.ErrorCount);



            return BadRequest("Model not valid in NewOrder!" + ModelState.ErrorCount);
        }


        public async Task<ActionResult> GetOrderById(int id)
        {
            var order = await _orderDB.GetOrderById(id);

            if (order == null)
            {
                _orderLog.LogInformation("Order with id: " + id + ", was not found");
                return NotFound("Order with id: " + id + ", was not found");
            }

            return Ok(order);
        }

    }

}
