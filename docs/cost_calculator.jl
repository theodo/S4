using ForwardDiff

const α = 1.10 # API Gateway (http) : 1.10 / Mreq
const λ = 0.2 # Lambda : 0.2 / Minvok 
const δλ = 1e6 * 0.000016667 # Lambda : 0.000016667 / Gbsec
const Nλu = 4 # 4 upload lambdas
const Nλd = 2 # 2 download lambdas
const λΔt = 0.1 # approximate lambdas up time = 100ms
const w_d = 1.4135 # DynamoDB : 1.4135 / MWCU 
const r_d = 0.28300 # DynamoDB : 0.28300 / MRCU
const ϵ = 1 # Event bridge : 1 / Mevents
const s = 0.023 # S3 : 0.023 / stored GB / month
const s_w = 5 # S3 : 5 / Mupload
const s_r = 0.4 # S3 : 0.4 / Mdownload 

function upload(α, λ, δλ, Nλu, w_d, r_d, ϵ, s_w)
    Nλu * (λ + 0.1 * δλ) + 2 * α + 2 * w_d + 2 * r_d + ϵ + s_w
end


function download(α, λ, δλ, Nλd, r_d, s_r) 
    Nλd * (λ + 0.1 * δλ) + α + 1 * r_d + s_r 
end

function stockage(s)
    1e4 * s
end

dupload = x -> ForwardDiff.gradient(x -> upload(x...), x);
ddownload = x -> ForwardDiff.gradient(x -> download(x...), x);

println("upload : $(upload(α, λ, δλ, Nλu, w_d, r_d, ϵ, s_w)), download : $(download(α, λ, δλ, Nλd, r_d, s_r)), stockage : $(stockage(s))")

println("upload sensitivities : $(dupload([α, λ, δλ, Nλu, w_d, r_d, ϵ, s_w]))\ndownload sensitivities : $(ddownload([α, λ, δλ, Nλd, r_d, s_r]))")