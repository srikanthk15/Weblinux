/* this is a unified, abstract interface (a facade) to the different
 * CPU implementations
 */

"use strict";
var message = require('../messagehandler'); // global variable
var toHex = require('../utils').ToHex;
var imul = require('../imul');

// CPUs
var FastCPU = require('./fastcpu');
var SafeCPU = require('./safecpu');
var SMPCPU = require('./smpcpu');
var DynamicCPU = require('./dynamic/dynamiccpu');

// The asm.js ("Fast") and SMP cores must be singletons
// because of Firefox limitations.
var fastcpu = null;
var smpcpu = null;

var stdlib = {
    Int32Array : Int32Array,
    Float32Array : Float32Array,
    Uint8Array : Uint8Array,
    Uint16Array : Uint16Array,
    Math : Math
};

function createCPUSingleton(cpuname, ram, heap, ncores) {
    var foreign = {
        DebugMessage: message.Debug,
        abort : message.Abort,
        imul : Math.imul || imul,
        Read32 : ram.Read32Big.bind(ram),
        Write32 : ram.Write32Big.bind(ram),
        Read16 : ram.Read16Big.bind(ram),
        Write16 : ram.Write16Big.bind(ram),
        Read8 : ram.Read8Big.bind(ram),
        Write8 : ram.Write8Big.bind(ram)
    };
    if (cpuname === 'asm') {
        if (fastcpu === null) {
            fastcpu = FastCPU(stdlib, foreign, heap);
            fastcpu.Init();
        }
        return fastcpu;
    } else if (cpuname === 'smp') {
        if (smpcpu === null) {
            smpcpu = SMPCPU(stdlib, foreign, heap);
            smpcpu.Init(ncores);
        }
        return smpcpu;
    }
}

function createCPU(cpuname, ram, heap, ncores) {
    var cpu = null;

    if (cpuname === "safe") {
        return new SafeCPU(ram);
    }
    if (cpuname === "dynamic") {
        return new DynamicCPU(ram);
    }
    if (cpuname === "asm") {
        cpu = createCPUSingleton(cpuname, ram, heap, ncores);
        cpu.Init();
        return cpu;
    }
    if (cpuname === "smp") {
        cpu = createCPUSingleton(cpuname, ram, heap, ncores);
        cpu.Init(ncores);
        return cpu;
    }
    throw new Error("invalid CPU name:" + cpuname);
}

function CPU(cpuname, ram, heap, ncores) {
    this.cpu = createCPU(cpuname, ram, heap, ncores);
    this.name = cpuname;
    this.ncores = ncores;
    this.ram = ram;
    this.heap = heap;
    this.littleendian = false;

    return this;
}

CPU.prototype.toString = function() {
    var r = new Uint32Array(this.heap);
    var str = '';
    str += "Current state of the machine\n";
    //str += "clock: " + toHex(cpu.clock) + "\n";
    str += "PC: " + toHex(this.cpu.pc<<2) + "\n";
    str += "next PC: " + toHex(this.cpu.nextpc<<2) + "\n";
    //str += "ins: " + toHex(cpu.ins) + "\n";
    //str += "main opcode: " + toHex(cpu.ins>>>26) + "\n";
    //str += "sf... opcode: " + toHex((cpu.ins>>>21)&0x1F) + "\n";
    //str += "op38. opcode: " + toHex((cpu.ins>>>0)&0x3CF) + "\n";

    for (var i = 0; i < 32; i += 4) {
        str += "   r" + (i + 0) + ": " +
            toHex(r[i + 0]) + "   r" + (i + 1) + ": " +
            toHex(r[i + 1]) + "   r" + (i + 2) + ": " +
            toHex(r[i + 2]) + "   r" + (i + 3) + ": " +
            toHex(r[i + 3]) + "\n";
    }
    
    if (this.cpu.delayedins) {
        str += "delayed instruction\n";
    }
    if (this.cpu.SR_SM) {
        str += "Supervisor mode\n";
    }
    else {
        str += "User mode\n";
    }
    if (this.cpu.SR_TEE) {
        str += "tick timer exception enabled\n";
    }
    if (this.cpu.SR_IEE) {
        str += "interrupt exception enabled\n";
    }
    if (this.cpu.SR_DME) {
        str += "data mmu enabled\n";
    }
    if (this.cpu.SR_IME) {
        str += "instruction mmu enabled\n";
    }
    if (this.cpu.SR_LEE) {
        str += "little endian enabled\n";
    }
    if (this.cpu.SR_CID) {
        str += "context id enabled\n";
    }
    if (this.cpu.SR_F) {
        str += "flag set\n";
    }
    if (this.cpu.SR_CY) {
        str += "carry set\n";
    }
    if (this.cpu.SR_OV) {
        str += "overflow set\n";
    }
    return str;
};

// forward a couple of methods to the CPU implementation
var forwardedMethods = [
    "Reset", 
    "Step",
    "RaiseInterrupt", 
    "Step",
    "AnalyzeImage",
    "GetTicks",
    "GetTimeToNextInterrupt",
    "ProgressTime", 
    "ClearInterrupt"];

forwardedMethods.forEach(function(m) {
    CPU.prototype[m] = function() {
        return this.cpu[m].apply(this.cpu, arguments);        
    };

});

module.exports = CPU;
